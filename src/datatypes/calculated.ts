"use strict";

import { parse } from "date-fns";

// constants
const DEFAULT_DELIMITER = ";#";

/**
 * Parse 'Url' Sharepoint type into an object with props for link and description.
 * @param {String} fieldValue - Field attribute string from Sharepoint XML response
 * @param {Object} [delimiter=";#"] Overwrite default delimiter
 */
export function parseCalculated(
  fieldValue: string,
  delimiter: string = DEFAULT_DELIMITER
) {
  const str: string = "" + fieldValue;
  const index: number = str.indexOf(delimiter);
  const type: string = str
    .slice(0, index)
    .toLowerCase()
    .trim();
  const value: string = str.slice(index + 2);
  let parsedValue = null;

  switch (type) {
    case "float":
      parsedValue = parseFloat(value);
      break;
    case "boolean":
      parsedValue = (value === "1") || (value.toLowerCase().trim() === "true");
      break;
    case "datetime":
      parsedValue = parse(value);
      break;
    default:
      parsedValue = value;
  }

  return parsedValue;
}
