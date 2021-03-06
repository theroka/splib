"use strict";

import { getType } from "./utils";

/**
 * Cast Javascript value into 'note' Sharepoint type.
 * Returns a XML string with escaped value string, enclosed in a CDATA tag.
 * @param {String} value
 * @return {String} XML string with escaped value string.
 */
export function castNote(value: string) {
  if (value === null) return "";
  let cast = "";
  if (getType(value) === "string") {
    cast = `<![CDATA[${value}]]>`;
  }
  return cast;
}
