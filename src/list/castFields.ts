"use strict";

import { createLog } from "../utils/log";
import {
  parseCalculated,
  parseMultiChoice,
  parseLookup,
  parseMultiLookup,
  parsePerson,
  parseMultiPerson,
  parseURL,
  parseBool,
  parseDatetimeUTC
} from "../datatypes";
import { unescapeSharepointText } from "../utils";
import { Fields, FieldDef, FuncMap } from "./types";
import { LookupData } from "../datatypes/types";

const log = createLog("list");

const parseFuncs: FuncMap = {
  "text": (v: any) => unescapeSharepointText(v),
  "note": (v: any) => unescapeSharepointText(v),
  "choice": (v: any) => unescapeSharepointText(v),
  "multichoice": (v: any) => parseMultiChoice(v),
  "integer": (v: any) => parseInt(v),
  "counter": (v: any) => parseInt(v),
  "number": (v: any) => parseFloat(v),
  "boolean": (v: any) => parseBool(v),
  "calculated": (v: any) => parseCalculated(v),
  "datetime": (v: any) => parseDatetimeUTC(v),
  "lookup": (v: any) => parseLookup(v),
  "lookupmulti": (v: any) => parseMultiLookup(v),
  "user": (v: any) => parsePerson(v),
  "usermulti": (v: any) => parseMultiPerson(v),
  "url": (v: any) => parseURL(v),
};


export function parseFieldValues(data: Array<any>, fields: Fields) {
  log.debug("parseFieldValues, data:", data, "fields:", fields);
  let values: any[];
  values = data.map(item => {

    let obj: any = {};

    fields.forEach((field: FieldDef) => {

      let attr = null;
      const attrName = "ows_" + field.name;
      const staticAttrName = "ows_" + field.staticName;

      switch (true) {
        case item[attrName] !== undefined:
          attr = attrName;
          break;
        case item[staticAttrName] !== undefined:
          attr = staticAttrName;
          break;
          // @TODO: Remove field match by display name
        case item[field.displayName] !== undefined:
          attr = field.displayName;
          break;
      }

      if (attr && field.mappedName) {
        // @TODO: Use default parse func. Return string if field type does not have assigned parse func.
        let mn = field.mappedName;
        switch (true) {
          case field.type === "lookup":
            let {id, value} = parseFuncs[field.type](item[attr]);
            obj[mn] = value;
            obj[`${mn}ID`] = id;
            break;
          case field.type === "multilookup":
            let kvs = parseFuncs[field.type](item[attr]);
            obj[mn] = kvs.map((v: LookupData) => v.value);
            obj[`${mn}ID`] = kvs.map((v: LookupData) => v.id);
            break;
          default:
            obj[mn] = parseFuncs[field.type](item[attr]);
            break;
        }
      }

    });

    return obj;
  });
  return values;
}
