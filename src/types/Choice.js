'use strict'

// local imports
import { getType } from './../utils'
import { _createDatetimeUTC } from './Datetime'

// constants
const DEFAULT_SP_DELIMTER = ';#'


/**
 * Parse and split multichoice value from Sharepoint into string array
 * @memberof module:Types
 * @alias module:Types._parseMultiChoice
 *
 * @param {String} str - String to parse
 * @returns {String[]}
 */
export function _parseMultiChoice (str, delimiter = DEFAULT_SP_DELIMTER) {
  if (!str || str == '' || str == null) return null
  return str
    .split(delimiter)
    .filter(e => e != '')
}


/**
 * Cast Javascript value into 'choice' Sharepoint type.
 * @memberof module:Types
 * @alias module:Types._createChoice
 * @private
 *
 * @param {Number|String|Boolean|Date} value - Value to create 'choice' string from
 * @return {String} - Returns empty string if passed value is empty or undefined
 *
 * @example
 * sharepoint._createChoice('hello') // --> ';#hello'
 */
export function _createChoice (value) {
  if (value === null || value === undefined || value === '') return ''
  let choices = []
  switch (getType(value)) {
    case 'number':
      choices.push('' + value)
      break
    case 'float':
      choices.push('' + parseInt(value))
      break
    case 'string':
      choices.push('' + value)
      break
    case 'date':
      const d = _createDatetimeUTC(value)
      choices.push(d)
      break
    default:
      choices.push('' + value)
  }
  return choices.join(';#')
}


/**
 * Joins array to Sharepoint type 'multichoice'.
 * @memberof module:Types
 * @alias module:Types._createMultiChoice
 * @private
 *
 * @param {String[]|Number[]} value
 * @param {String} [delimiter=';#'] Overwrite default Sharepoint delimiter
 * @return {String}
 *
 * @example
 * const arr = [ 'hello', 'world' ]
 * sharepoint._createMultiChoice(arr) // --> ';#hello;#worl;#'
 */
export function _createMultiChoice (value, delimiter = DEFAULT_SP_DELIMTER) {
  if (value === null) return ''
  const isArray = value instanceof Array
  if (isArray) {
    const choices = value.join(delimiter)
    return delimiter + choices + delimiter
  } else {
    return null
  }
}
