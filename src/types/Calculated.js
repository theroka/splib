'use strict'

// local imports
import { _parseDatetimeUTC } from './Datetime'

// constants
const DEFAULT_DELIMITER = ';#'

/**
 * Parse 'Url' Sharepoint type into an object with props for link and description.
 * @memberof module:Types
 * @alias module:Types._parseCalculated
 * @private
 *
 * @param {String} fieldValue - Field attribute string from Sharepoint XML response
 * @param {Object} [options]
 * @param {Object} [options.delimiter=';#'] Overwrite default delimiter
 * @param {Object} [options.includeType=false] Return object with { type, value, parsedValue }
 */
export function _parseCalculated (fieldValue, options) {
  const defaultOptions = { delimiter: DEFAULT_DELIMITER, includeType: false }
  options = { ...defaultOptions, ...options }
  const str = '' + fieldValue
  const index = str.indexOf(options.delimiter)
  const type = str.slice(0, index)
  const value = str.slice(index + 2)
  let parsedValue = null
  switch (type) {
    case 'float':
      parsedValue = parseFloat(value)
      break
    case 'boolean':
      parsedValue = (value == 1 ? true : false)
      break
    case 'datetime':
      parsedValue = _parseDatetimeUTC(value)
      break
    default:
      parsedValue = value
  }
  if (options.includeType) {
    return { type, value, parsedValue }
  } else {
    return parsedValue
  }
}
