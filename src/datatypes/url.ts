"use strict";

interface Link {
  url: string,
  description: string
}

const DELIMITER = ",";

/**
 * Parse 'Url' Sharepoint type into an object with props for link and description.
 * @param {String} link
 * @param {String} [delimiter=","]
 * @returns {Link}
 */
export function parseURL(link: string, delimiter = DELIMITER): Link {
  const parts = ("" + link).split(delimiter);
  const url = parts[0].trim();
  const description = parts[1].trim();
  return { url, description };
}
