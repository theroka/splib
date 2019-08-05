"use strict";

import { concat, mergeWith } from "ramda";
import { QueryString, List, FieldMap, FieldDef, Fields } from "./types";
import { _getDefaultFields, getFieldID } from "./../utils";
import { getOptions, endpointURL, createSoapBody, parser } from "./../caml";
import { getCurrentSite } from "./../site";
import { parseFieldValues } from "./castFields";
import { getList } from "./getList";
import { SiteURL } from "../user/types";

// constants
const ACTION = "GetListItems";

/**
 * Get items from a Sharepoint list
 * @param {String} listname Name of Sharepoint list
 * @param {Object} [options]
 * @param {String} [options.site] URL to Sharepoint site
 * @return {Promise<Object[]>}
 */
export async function getItems(
  listname: string,
  fields: FieldMap,
  query: QueryString = null,
  site: SiteURL = null
) {
  const siteUrl = site || (await getCurrentSite());
  const list: List = await getList(listname, siteUrl);

  const mappedFields = mapFields(list, fields);

  const caml = generateCAML(listname, mappedFields, query);
  const body = createSoapBody(ACTION, caml);
  const url = endpointURL(ACTION, siteUrl);
  const options = getOptions(ACTION);

  let response = await fetch(url, { ...options, body });
  let xml = await response.text();
  let data = parser(xml, ACTION, "listitems.data.row");

  let items = parseFieldValues(data, mappedFields);

  return items;
}

/**
 * @param {Object} list
 * @param {Object} fields
 * @return {Object}
 */
function mapFields(list: List, fields: FieldMap): Fields {
  const cols = mergeWith(concat, "ID", Object.keys(fields));
  let mapped: Fields = [];
  list.fields.map((listField: FieldDef) => {
    const { staticName, displayName } = listField;
    const inFieldMap = cols.includes(staticName) || cols.includes(displayName);
    if (inFieldMap) {
      let mappedName = fields[staticName] || fields[displayName];
      mapped.push({ ...listField, mappedName });
    }
  });
  return mapped;
}

/**
 * @param {String} listname - Name of Sharepoint list
 * @param {String} [query=''] - Optional CAML query to filter result
 * @param {String} viewfields - String with FieldRef-Nodes to get specific fields from Sharepoint list
 * @param {Integer} [rowlimit=5000] - Limit of rows in response
 * @return {String} - Return CAML/XML string
 */
function generateCAML(
  listname: string,
  fields: Fields,
  query: QueryString = null
) {
  const viewfields = fields
    .map(
      (field: FieldDef) =>
        `<FieldRef ID="${field.id}" Name="${field.staticName}"/>`
    )
    .join("\n");

  return `
    <listName>${listname}</listName>
    <viewName></viewName>
    <query>
      <Query>
        ${query}
      </Query>
    </query>
    <viewFields>
      <ViewFields Properties='True'>
        ${viewfields}
      </ViewFields>
    </viewFields>
    <rowLimit>5000</rowLimit>
    <queryOptions>
      <QueryOptions>
        <DateInUtc>TRUE</DateInUtc>
        <Paging ListItemCollectionPositionNext=""></Paging>
        <IncludeAttachmentsUrls>TRUE</IncludeAttachmentsUrls>
        <IncludeMandatoryColumns>TRUE</IncludeMandatoryColumns>
        <ExpandUserField>TRUE</ExpandUserField>
        <ViewAttributes Scope="Recursive"></ViewAttributes>
      </QueryOptions>
    </queryOptions>`;
}
