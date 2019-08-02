'use strict'

// local imports
import { getType } from './../utils'

/**
 * Cast Javascript value into 'boolean' Sharepoint type.
 * @memberof module:Types
 * @alias module:Types._createBoolean
 * @private
 *
 * @param {Number|Boolean|String} value Javascript value to cast into 'boolean' Sharepoint type
 * @return {String} 'TRUE' or 'FALSE'. Default: 'FALSE'
 *
 * @example
 * _createBoolean(1) // true
 * _createBoolean(-1) // false
 * _createBoolean(2) // false
 * _createBoolean(0) // false
 *
 * _createBoolean(true) // true
 * _createBoolean(false) // false
 *
 * _createBoolean('True') // true
 * _createBoolean('False') // false
 * _createBoolean('Foobar') // false
 *
 */
export function _createBoolean (value) {
  if (value === null) return ''
  let cast = null
  switch (getType(value)) {
    case 'number':
      cast = (value === 1) ? 'TRUE' : 'FALSE'
      break
    case 'float':
      cast = (Math.floor(value) === 1) ? 'TRUE' : 'FALSE'
      break
    case 'boolean':
      cast = value ? 'TRUE' : 'FALSE'
      break
    case 'string':
      cast = value == 1 || value.toLowerCase() == 'true' ? 'TRUE' : 'FALSE'
      break
    default:
      cast = 'FALSE'
  }
  return cast
}
