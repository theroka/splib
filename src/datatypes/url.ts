"use strict";

/**
 * Parse 'Url' Sharepoint type into an object with props for link and description.
 * @param {String} url
 */
export function parseURL(url: string, delimiter = ",") {
  const parts = ("" + url).split(delimiter);
  const link = parts[0].trim();
  const description = parts[1].trim();
  return { url: link, description };
}
