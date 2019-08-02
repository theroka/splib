'use strict'

import { createLog, _toXslString } from './../utils'

const log = createLog('utils/Listfields')

/**
 * Get default field map. Used to map fields to item props automatically, if you
 * do not passed field names you want to fetch from a Sharepoint list.
 * @memberof module:Utils
 * @alias module:Utils._getDefaultFields
 *
 * @param {Object} list - List object
 */
export function _getDefaultFields (list) {
  const unselect = ['FolderChildCount', 'ItemChildCount', 'Attachments', '_UIVersionString']
  const visibleFields = list.filter(f => {
    return f.hidden === false
      && f.type != 'computed'
      && f.type != 'lookup'
      && f.type != 'lookupmulti'
      && !unselect.includes(f.name)
  })
  log.debug('_getDefaultFields(), List object:', list, 'filtered:', fields)
  const fields = {}
  visibleFields.forEach(f => {
    const n = f.name.replace('ows_', '')
    fields[f.name] = n.toLowerCase()
  })
  return fields
}


/**
 * get ID of sharepoint listfield by fieldname
 * checks against static names, names and display names of fields
 * @memberof module:Utils
 * @alias module:Utils.getFieldID
 *
 * @param {Field[]} listfields - Fields collection
 * @param {String} fieldname - Name of field to get ID of
 *
 * @TODO: Add switch cases usings XSL field names.
 */
export function getFieldID (listfields = [], fieldname = '') {
  const dn = new Map()
  const sn = new Map()
  const nm = new Map()
  const field = fieldname.toLowerCase().trim()
  const xslField = _toXslString(field)

  listfields.forEach(f => {
    // @NOTE: Added this filter to prevent set "Title" by DisplayName,
    // since multiple (computed) fields have the same display name.
    // if (f.type.toLowerCase() != 'computed') {
      dn.set(f.displayName.toLowerCase(), f.id)
    // }
      sn.set(f.staticName.toLowerCase(), f.id)
      nm.set(f.name.toLowerCase(), f.id)
  })

  let id = null

  switch (true) {
    case sn.has(xslField):
    case sn.has(field):
      id = sn.get(field)
      break
    case nm.has(xslField):
    case nm.has(field):
      id = nm.get(field)
      break
    case dn.has(field):
      id = dn.get(field)
      break
  }

  return id
}
