'use strict'

// local imports
import { getType } from './../utils'

/**
 * Cast Javascript value into 'number' Sharepoint type
 * @memberof module:Types
 * @alias module:Types._createNumber
 * @private
 *
 * @param {String|Number} value
 * @param {Number} [precision=12]
 * @return {String}
 *
 * @example
 * sharepoint._createNumber(1) // --> '1.000000000000'
 * sharepoint._createNumber(1, 5) // --> '1.00000'
 * sharepoint._createNumber("1.000") // --> '1.000'
 * sharepoint._createNumber(true) // --> '0.000000000000'
 * sharepoint._createNumber({}, 4) // --> '0.0000'
 */
export function _createNumber (value, precision = 12) {
  if (value === null) return ''
  let cast = null
  switch (getType(value)) {
    case 'float':
    case 'number':
      cast = '' + value.toFixed(precision)
      break
    case 'string':
      cast = value
      break
    default:
      cast = '' + (0).toFixed(precision)
  }
  return cast
}
