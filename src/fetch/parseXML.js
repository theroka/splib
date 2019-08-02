'use strict'

// imports
const fxp = require('fast-xml-parser')

// constants
const PARSER_OPTIONS = {
  attributeNamePrefix : '',
  ignoreAttributes : false,
  ignoreNameSpace : true,
  allowBooleanAttributes : true,
  parseNodeValue : false,
  parseAttributeValue : false,
  trimValues: true,
}


/**
 * Parse XML response into JSON
 * @memberof module:Fetch
 * @alias module:Fetch._parseXML
 * @private
 *
 * @param {String} xml - XML string to parse
 * @param {String} action - Name of CAML action
 * @param {String} [path=null] - XML path to 'root' XML element to start parsing at
 * @param {Object} [options]
 * @param {Object} [options.asArray] - If true, return result as array.
 */
export function _parseXML (xml, action, path = null, options = {}) {
  const keys = [].concat.apply([], [
    ['Envelope', 'Body', `${action}Response`, `${action}Result`],
    (path ? path.split('.') : [])
  ])

  let data = fxp.parse(xml, PARSER_OPTIONS)

  keys.some(key => {
    if (data[key] === undefined) return true
    data = data[key]
  })

  if (!(data instanceof Array) && options.asArray) {
    return [].concat.apply([], [data])
  } else {
    return data
  }
}
