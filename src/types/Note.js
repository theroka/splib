'use strict'

import { getType } from './../utils'

/**
 * Cast Javascript value into 'note' Sharepoint type.
 * Returns a XML string with escaped value string, enclosed in a CDATA tag.
 * @memberof module:Types
 * @alias module:Types._createNote
 * @private
 *
 * @param {String} value
 * @return {String} XML string with escaped value string.
 *
 */
export function _createNote (value) {
  if (value === null) return ''
  let cast = null
  switch (getType(value)) {
    case 'string':
      cast = `<![CDATA[${value}]]>`
      break
    default:
      cast = ''
  }
  return cast
}
