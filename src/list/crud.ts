"use strict";

import { mergeWith, concat } from "ramda";
import { chunkArray, getFieldID } from "../utils";
import {
  getOptions,
  endpointURL,
  createSoapBody,
  parser,
  generateItemCAML
} from "../caml";
import {
  castBool,
  castMultiChoice,
  castDatetimeUTC,
  castInteger,
  castLookup,
  castMultiLookup,
  castNote,
  castPerson,
  castText
} from "../datatypes";
import { getCurrentSite } from "../site";
import { getList } from "./getList";
import { SiteURL } from "../user/types";
import { Fields, DataItem, FieldDef, FuncMap } from "./types";
import props from "ramda/es/props";

const action = "UpdateListItems";
const options = getOptions(action);

/**
 * Add new items to a Sharepoint list.
 * If you pass items with propertyX = null, these fields will be set to "" (empty CAML string).
 * @param {String} listname
 * @param {Object[]} items
 * @param {Object} [options]
 * @param {String} [options.site=null]
 * @param {String} [options.op='New']
 * @return {Promise<Object[]>}
 */
export async function _crudListItems(
  listname: string,
  items: Array<any> = [],
  operation: string,
  site: SiteURL = null
) {
  const siteUrl = site || (await getCurrentSite());
  const list = await getList(listname, siteUrl);

  // preprocess items
  const mappedItems = items
    .slice()
    .map((item: DataItem) => mapProperties(item, list.fields));
  const castedItems = mappedItems.map((item: DataItem) =>
    typePropValue(item, list.fields)
  );
  operation = operation.charAt(0).toUpperCase() + operation.slice(1);
  const camlItems = generateItemCAML(castedItems, operation);
  const chunkedItems = chunkArray(camlItems.slice(), 160);

  const batches = chunkedItems.map((chunk: any) => {
    const items = chunk.map((item: string, index: number) => {
      return `
        <Method ID="${index + 1}" Cmd="${operation}">
          ${item}
        </Method>`;
    });
    return items.join("\n");
  });

  const camlBodies = batches.map((batch: string) => {
    return createSoapBody(
      "UpdateListItems",
      `<listName>${listname}</listName>
      <updates>
        <Batch OnError="Continue">
          ${batch}
        </Batch>
      </updates>`
    );
  });

  let requests = camlBodies.map((body: string) => {
    const url = endpointURL(action, siteUrl);
    return fetch(url, { ...options, body })
      .then(response => response.text())
      .then(xml => parser(xml, action, "Results.Result"))
      .then(results => results.map(r => r.row))
      .catch(err => {
        throw Error(err.message);
      });
  });

  return Promise.all(requests).then(responses =>
    mergeWith(concat, [], responses)
  );
}

/**
 * Return item collection where props names are changed with
 * the field IDs of the Sharepoint list.
 * A collection item only contains ID props where original props
 * names and field names are matching.
 * Item props which does not match with any field of the list are omitted.
 * @param {Object[]} items - Items collection to map
 * @param {Object[]} fields - List fields collection
 * @return {Object[]} Mapped items collection
 * @TODO: Add option, to omit computed/calculated field on creating or updating list items.
 */
// function mapProperties(items: DataItem[], fields: Fields) {
function mapProperties(item: DataItem, fields: Fields = []) {
  let props: string[] = Object.keys(item);
  let mapped: DataItem = {};
  props.forEach((prop: string) => {
    let id = getFieldID(fields, prop);
    if (id) {
      let field = fields.find(field => field.id === id);
      if (field) {
        mapped[field.name] = item[prop];
      }
    }
  });
  return mapped;
}

function getFieldType(name: string, fields: Fields): string | null {
  let field = fields.find((field: FieldDef) => field.name === name);
  if (field) {
    return field.type;
  } else {
    return null;
  }
}

const castFuncs: FuncMap = {
  counter: (v: any) => castInteger(v),
  integer: (v: any) => castInteger(v),
  text: (v: any) => castText(v),
  note: (v: any) => castNote(v),
  boolean: (v: any) => castBool(v),
  datetime: (v: any, b: boolean) => castDatetimeUTC(v, b),
  person: (v: any) => castPerson(v),
  multichoice: (v: any) => castMultiChoice(v),
  lookup: (v: any) => castLookup(v),
  multilookup: (v: any) => castMultiLookup(v)
};

/**
 * Cast prop values of mapped item collection into Sharepoint types.
 * On the JS side, all casted prop values are typed as string.
 */
function typePropValue(item: DataItem, fields: Fields) {
  let propNames = Object.keys(item);
  let casted: DataItem = {};
  propNames.forEach((propName: string) => {
    let spType = getFieldType(propName, fields);
    let value: any = item[propName];
    let castedValue = spType
      ? castFuncs[spType](value)
      : castText(value);
    casted[propName] = castedValue;
  });
  return casted;
}
