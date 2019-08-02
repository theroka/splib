'use strict'

/**
 * Parse 'Url' Sharepoint type into an object with props for link and description.
 * @memberof module:Types
 * @alias module:Types._parseUrl
 * @private
 *
 * @param {String} url
 */
export function _parseUrl (url, delimiter = ',') {
  const parts = ('' + url).split(delimiter)
  const link = parts[0].trim()
  const description = parts[1].trim()
  return { url: link, description }
}
