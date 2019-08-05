"use strict";

import { getType } from "./utils";

/**
 * Cast Javascript value into 'integer' Sharepoint type.
 * @param {String|Number} value
 * @return {String}
 * @example
 * sharepoint.castInteger(1) // -> '1'
 * sharepoint.castInteger(1.3) // -> '1'
 * sharepoint.castInteger(1.6) // -> '2'
 * sharepoint.castInteger("5") // -> '5'
 * sharepoint.castInteger(null) // -> ''
 * sharepoint.castInteger(true) // -> '0'
 * sharepoint.castInteger([1, 2, 3]) // -> '0'
 */
export function castInteger(value: any): string {
  if (value === null) return "";
  let cast = null;
  switch (getType(value)) {
    case "float":
    case "number":
      cast = "" + parseInt(value);
      break;
    case "string":
      cast = value;
      break;
    case "boolean":
      cast = value ? "1" : "0";
      break;
    default:
      cast = "";
  }
  return cast;
}
