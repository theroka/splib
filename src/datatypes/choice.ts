"use strict";

import { getType } from "./utils";
import { castDatetimeUTC } from "./Datetime";

const DEFAULT_SP_DELIMITER = ";#";

/**
 * Parse and split multichoice value from Sharepoint into string array
 * @param {String} input - String to parse
 * @param {String} [delimiter=";#"] Define choice values delimiter.
 * @returns {String[]}
 */
export function parseMultiChoice(
  input: string,
  delimiter: string = DEFAULT_SP_DELIMITER
) {
  if (!input || input == "" || input == null) return null;
  let values: Array<string> = input.split(delimiter);
  return values.filter(
    (value: string) => !["", null, undefined].includes(value)
  );
}

/**
 * Cast Javascript value into 'choice' Sharepoint type.
 * @param {Number|String|Boolean|Date} value - Value to create 'choice' string from
 * @return {String} - Returns empty string if passed value is empty or undefined
 * @example
 * sharepoint.castChoice('hello') // --> ';#hello'
 */
export function castChoice(value: any) {
  if (value === null || value === undefined || value === "") return "";
  let choices = [];
  switch (getType(value)) {
    case "number":
      choices.push("" + value);
      break;
    case "float":
      choices.push("" + parseInt(value));
      break;
    case "string":
      choices.push("" + value);
      break;
    case "date":
      const d = castDatetimeUTC(value);
      choices.push(d);
      break;
    default:
      choices.push("" + value);
  }
  return choices.join(";#");
}

/**
 * Joins array to Sharepoint type 'multichoice'.
 * @param {String[]|Number[]} values
 * @param {String} [delimiter=";#"] Overwrite default Sharepoint delimiter
 * @return {String}
 *
 * ````javascript
 * const arr = [ 'hello', 'world' ]
 * sharepoint.castMultiChoice(arr) // --> ';#hello;#world;#'
 * ````
 */
export function castMultiChoice(
  values: Array<any>,
  delimiter = DEFAULT_SP_DELIMITER
): string {
  if (values === null || !(values instanceof Array)) return "";
  let choices: Array<any> = values.filter(
    (value: any) => !["", null, undefined].includes(value)
  );
  //@TODO: Map casting function to all values, to handle e.g. JS dates.
  return `${delimiter}${choices.join(delimiter)}${delimiter}`;
}
