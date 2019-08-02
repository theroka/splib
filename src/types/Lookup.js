'use strict'

// module imports
import { createLog } from '../utils'

// constants
const log = createLog('types/Lookup')
const DEFAULT_SP_DELIMTER = ';#'

/**
 * Parse and split lookup value into ID and value.
 * @memberof module:Types
 * @alias module:Types._parseLookup
 * @private
 *
 * @param {String} str
 * @param {Object} options
 * @param {String} [options.delimiter=';#']
 * @param {Boolean} [options.includeLookupValue=false] Returns {id, value} object if true
 * @return {Object|Integer}
 */
export function _parseLookup (str, options) {
  options = { delimiter: ';#', includeLookupValue: false, ...options }
  const kv = str.split(options.delimiter)
  const id = parseInt(kv[0])
  const value = kv[1]
  // return { id, value }
  return options.includeLookupValue === true ? { id, value } : id
}

/**
 * Parse and split multilookip into array.
 * @memberof module:Types
 * @alias module:Types._parseMultiLookup
 * @private
 *
 * @param {String} str
 * @param {Object} options
 * @return {Integer[]|Object[]}
 */
export function _parseMultiLookup (str, options) {
  options = { delimiter: ';#', includeLookupValue: false, ...options }
  const arr = str.split(options.delimiter)
  let values = []
  arr.map((elem, index, collection) => {
    if (index % 2 === 0) {
      const id = parseInt(elem);
      const value = collection[index + 1];
      if (id && !options.includeLookupValue) values.push(id)
      if (id && value && options.includeLookupValue) values.push({ id, value })
    }
  })
  return values.length != 0 ? values : null
}


/**
 * Cast string or number into Sharepoint type 'lookup'
 * @memberof module:Types
 * @alias module:Types._createLookup
 * @private
 *
 * @param {String|Number} value
 * @param {String} [delimiter=';#'] Overwrite default Sharepoint delimiter
 * @return {String}
 *
 * @example
 * sharepoint._createLookup('foobar') // --> '-1;#foobar'
 * sharepoint._createLookup('1337;#hello') // --> '1337;#hello'
 */
export function _createLookup (value, delimiter = DEFAULT_SP_DELIMTER) {
  if (value === null) return ''
  const regexID = /^\-?[0-9]+;#.*$/g
  const prefix = regexID.test('' + value) ? '' : '-1;#'
  return prefix + value
}


/**
 * Create SP string to CRUD multilookup value.
 * Passed value has to be an array.
 * Array items can be string, array or object.
 * Pass item collection as [{ id, value }, { id, value }, ...]
 * Pass array collection as [[ id, value ], [ id, value ], ... ]
 * @memberof module:Types
 * @alias module:Types._createMultiLookup
 * @private
 *
 * @param {Object[]|Array[]} value
 * @param {String} delimiter
 * @return {String}
 *
 * @TODO: Add return value descr to doc comments
 */
export function _createMultiLookup (value, delimiter = DEFAULT_SP_DELIMTER) {
  if (value === null) return ''
  const isArray = value instanceof Array
  const regexID = /^\-?[0-9]+;#.*$/g
  let arr = []
  // @NOTE: Good idea? if (!isArray) value = [value]
  if (isArray) {
    value.forEach(item => {
      switch (true) {
        case typeof item == 'string':
          // @TODO: Check if lookup can be updated with unknown ref ID '-1'
          const prefix = regexID.test('' + value) ? '' : '-1;#'
          arr.push(prefix + value)
          break
        case typeof item == 'object' && !(item instanceof Array):
          if (item.id != undefined && item.value != undefined) {
            arr.push(item.id)
            arr.push(item.value)
          }
          break
        case (item instanceof Array) == true:
          arr.push(item[0])
          arr.push(item[1])
          break
      }
    })
    return arr.join(delimiter)
  } else {
    return null
  }
}
