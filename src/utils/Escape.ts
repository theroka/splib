"use strict";

type Unescaped = string | null;

/**
 * Escape string with XML/UTF entities.
 * Escapes the passed string with Sharepoint-compatible entities, to store the escaped
 * string in Sharepoint list fields safely.
 * @param {String} text
 * @return {String}
 */
export function escapeSharepointText(text: Unescaped): string {
  if (!text) return "";
  return ("" + text)
      .slice()
      .replace(/\n/g, "&#13;&#10;") // linefeed
      .replace(/\t/g, "&#9;") // tab
      .replace(/'/g, "&#39;")
      .replace(/"/g, "&quot;")
      .replace(/&/g, "&amp;")
      .replace(/>/g, "&gt;")
      .replace(/</g, "&lt;");
}

/**
 * Unescape string with XML/UTF entities.
 * Unescapes the passed string with Sharepoint-compatible entities, to use the string
 * in JS and JSON.
 * @param {String} text
 * @return {String}
 */
export function unescapeSharepointText(text: Unescaped): string {
  if (!text) return "";
  return ("" + text)
      .slice()
      .replace(/&#13;&#10;/g, "\n") // linefeed
      .replace(/&#10;/g, "\n") // linebreak
      .replace(/&#9;/g, " ") // replace tab with single space
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, "&")
      .replace(/&gt;/g, ">")
      .replace(/&lt;/g, "<");
}
