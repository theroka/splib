"use strict";

import { getType } from "./utils";

/**
 * Parse response XML value to boolean
 */
export function parseBool(input: string): boolean {
  return input.toLowerCase().trim() === "true";
}

/**
 * Cast Javascript value into 'boolean' Sharepoint type.
 * @param {Number|Boolean|String} value Javascript value to cast into 'boolean' Sharepoint type
 * @return {String} 'TRUE' or 'FALSE'. Default: 'FALSE'
 * ````javascript
 * castBool(1) // true
 * castBool(-1) // false
 * castBool(2) // false
 * castBool(0) // false
 * castBool(true) // true
 * castBool(false) // false
 * castBool('True') // true
 * castBool('False') // false
 * castBool('Foobar') // false
 * ````
 */
export function castBool(value: any) {
  if (value === null) return "";
  let cast = null;
  switch (getType(value)) {
    case "number":
      cast = value === 1 ? "TRUE" : "FALSE";
      break;
    case "float":
      cast = Math.floor(value) === 1 ? "TRUE" : "FALSE";
      break;
    case "boolean":
      cast = value ? "TRUE" : "FALSE";
      break;
    case "string":
      cast = value == 1 || value.toLowerCase().trim() == "true" ? "TRUE" : "FALSE";
      break;
    default:
      cast = "FALSE";
  }
  return cast;
}
