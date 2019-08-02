'use strict'

// local imports
import { getType } from './../utils'

/**
 * Cast Javascript value into 'integer' Sharepoint type.
 * @memberof module:Types
 * @alias module:Types._createInteger
 * @private
 *
 * @param {String|Number} value
 * @return {String}
 *
 * @example
 * sharepoint._createInteger(1) // -> '1'
 * sharepoint._createInteger(1.3) // -> '1'
 * sharepoint._createInteger(1.6) // -> '2'
 * sharepoint._createInteger("5") // -> '5'
 *
 * sharepoint._createInteger(null) // -> ''
 * sharepoint._createInteger(true) // -> '0'
 *
 * sharepoint._createInteger([1, 2, 3]) // -> '0'
 */
export function _createInteger (value) {
  if (value === null) return ''
  let cast = null
  switch (getType(value)) {
    case 'float':
    case 'number':
      cast = '' + parseInt(value)
      break
    case 'string':
      cast = value
      break
    default:
      cast = '' + 0
  }
  return cast
}
