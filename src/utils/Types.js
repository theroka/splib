'use strict'

/**
 * Returns a string which defines the Javascript type of the passed value.
 * Objects, dates, arrays and floats are named individually.
 * @memberof module:Utils
 * @alias module:Utils.getType
 *
 * @param {*} value - JS value get type from
 * @return {String} - Type of passed value
 */
export function getType (value) {
  let type = typeof value
  type = ((type === 'object') && (value === null)) ? 'null' : typeof value
  type = ((type === 'object') && (value instanceof Array)) ? 'array' : typeof value
  type = ((type === 'object') && (value instanceof Date)) ? 'date' : typeof value
  // to check if the stringified number includes a stop char, can detect an "1.0" as a float too
  type = ((type === 'number') && (('' + value).includes('.'))) ? 'float' : typeof value
  return type.toLowerCase()
}
