'use strict'

import { createLog } from './../utils'
import { _crudListItems } from './CRUD'

const log = createLog('list/DeleteListItems')


/**
 * Update collection of list items in a Sharepoint list
 * @memberof module:List
 * @alias module:List.deleteItems
 *
 * @param {String} listname Name of Sharepoint list
 * @param {Object[]} items Item collection
 * @param {Object} [options]
 * @param {String} [options.site] URL to Sharepoint site. Default: current site
 */
export async function deleteItems (listname, items = [], { site = null } = {}) {
  const url = site || await getCurrentSite()
    .catch(error => { throw Error(error.message) })
  return _crudListItems(listname, items, { op: 'Delete', site: url })
}
