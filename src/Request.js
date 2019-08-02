'use strict'

import { createLog } from './utils'

const log = createLog('Request')


export function checkFieldnames (listfields, fields) {
  // create indices for each type of name
  let nm = new Map()
  let sn = new Map()
  let dn = new Map()
  let fieldnames = Object.keys(fields).map(f => f.trim())

  listfields.forEach(listfield => {
    const id = listfield.ID
    nm.set(listfield.Name, id)
    sn.set(listfield.StaticName, id)
    dn.set(listfield.DisplayName, id)
  })

  log.debug('sharepoint/checkFieldnames()')
  log.debug('    names', nm)
  log.debug('    staticNames', sn)
  log.debug('    displayNames', displayNames)
  log.debug('    fields', fields)

  return fieldnames.map(field => {

    if (
      nm.has(field) ||
      sn.has(field) ||
      dn.has(field)
    ) {
      const id = nm.get(field) || sn.get(field) || dn.get(field)
      const staticName = listfields.find(f => f.ID === id).StaticName
      const propName = fields[field]
      return { id, staticName, propName }
    }
  })

}
