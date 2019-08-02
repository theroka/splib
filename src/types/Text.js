'use strict'

// local imports
import { getType } from './../utils'
import { _createDatetimeUTC } from './Datetime'

/**
 * Cast JS typed values into Text form used by Sharepoint list fields.
 * @Note: All Sharepoint types are represented as JS strings.
 * @memberof module:Types
 * @alias module:Types._createText
 * @private
 *
 * @param {String|Number|Date|Object|Any[]} value Javascript value to cast into 'text'
 * @return {String} Sharepoint 'text' value
 * @return {Null} Return null if type cannot be casted
 *
 */
export function _createText (value) {
  if (value === null) return ''
  let cast = null

  switch (getType(value)) {
    case 'boolean':
      cast = value ? 'TRUE' : 'FALSE'
      break
    case 'string':
      cast = value
      break
    case 'number':
      cast = value.toString()
      break
    case 'float':
      // @NOTE: To use .toFixed() additionally, useful?
      cast = value.toString()
      break
    case 'date':
      cast = _createDatetimeUTC(value)
      break
    case 'array':
      cast = value
        .map(x => `${ _createText(x) }`)
        .join('; ')
      break
    case 'object':
      cast = Object
        .keys(value)
        .map(key => `${key}: ${ _createText(value[key]) }`)
        .join(', ')
      break
  }
  return cast
}
