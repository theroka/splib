"use strict";

import { getType } from "./utils";

/**
 * Cast JS typed values into Text form used by Sharepoint list fields.
 * @Note: All Sharepoint types are represented as JS strings.
 * @param {String|Number|Date|Object|Any[]} value Javascript value to cast into 'text'
 * @return {String} Sharepoint 'text' value
 * @return {Null} Return null if type cannot be casted
 */
export function castText(value: string): string | null {
  if (value === null) return "";
  let cast = null;

  switch (getType(value)) {
    case "boolean":
      cast = value ? "TRUE" : "FALSE";
      break;
    case "string":
      cast = value;
      break;
    case "number":
      cast = value.toString();
      break;
    case "float":
      // @NOTE: To use .toFixed() additionally, useful?
      cast = value.toString();
      break;
  }
  return cast;
}
