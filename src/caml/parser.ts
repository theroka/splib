"use strict";

// imports
const fxp = require("fast-xml-parser");
import { Path, Action } from "./types";

// constants
const PARSER_OPTIONS = {
  attributeNamePrefix: "",
  ignoreAttributes: false,
  ignoreNameSpace: true,
  allowBooleanAttributes: true,
  parseNodeValue: false,
  parseAttributeValue: false,
  trimValues: true
};

/**
 * Parse XML response into JSON
 * @param {String} xml - XML string to parse
 * @param {String} action - Name of CAML action
 * @param {String} [path=null] - XML path to 'root' XML element to start parsing at
 */
export function parser(
  xml: string,
  action: Action,
  path: Path = null
): Array<any> {
  const keys = [
    "Envelope",
    "Body",
    `${action}Response`,
    `${action}Result`
  ].concat(path ? path.split(".") : []);

  let data = fxp.parse(xml, PARSER_OPTIONS);

  keys.some((key: string) => {
    if (data[key] === undefined) return true;
    data = data[key];
  });

  return [].concat.apply([], [data]);
}
