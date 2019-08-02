'use strict'

import { createLog } from './../utils'
import { getCurrentSite } from './../site'
import { _crudListItems } from './CRUD'

const log = createLog('list/UpdateListItems')


/**
 * Update collection of list items in sharepoint list
 * @memberof module:List
 * @alias module:List.updateItems
 *
 * @param {String} listname Name of Sharepoint list
 * @param {Object[]} items Collection of updated items
 * @param {Object} [options]
 * @param {String} [options.site] URL to Sharepoint site
 * @return {Promise<Object[]>}
 *
 */
export async function updateItems (listname, items = [], { site = null } = {}) {
  const url = site || await getCurrentSite()
    .catch(error => { throw Error(error.message) })
  return _crudListItems(listname, items, { op: 'Update', site: url })
}
