"use strict";

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
import { unescapeSharepointText } from "./../utils";
import { Fields, FieldDef, FuncMap } from "./types";


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
}


export function parseFieldValues(data: Array<any>, fields: Fields) {

  return data.map(item => {

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
        case item[field.displayName] !== undefined:
          attr = field.displayName;
          break;
      }

      if (attr && field.mappedName) {
        obj[field.mappedName] = parseFuncs[field.type](item[attr])
      }

    });

    return obj;
  });

}
