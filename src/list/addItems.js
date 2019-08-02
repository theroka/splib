'use strict'

import { createLog } from './../utils'
import { getCurrentSite } from './../site'
import { _crudListItems } from './CRUD'

const log = createLog('list/AddListItems')


/**
 * Add items to Sharepoint list.
 * Pass items as object collection. The item property names are matched
 * to the fields of the Sharepoint list.
 * You can use the display names, static or
 * system names of the Sharepoint list as item properties.
 * @memberof module:List
 * @alias module:List.addItems
 *
 * @param {String} listname Name of Sharepoint list
 * @param {Object[]} items Item collection to add to Sharepoint list.
 * @param {Object} [options]
 * @property {String} [options.site] URL of Sharepoint site. Default: Current site.
 *
 * @example
 * const listname = 'Name of sharepoint list'
 *
 * const items = [{
 *     { Title: "Foo", Field2: 1337, Field3: "Bar" },
 *     { Title: "Baz", Field2: 9000, Field3: "Lorem ipsum dolor sit." },
 * }]
 *
 * addItems(listname, items)
 *     .then(response => console.log(response))
 *
 */
export async function addItems (listname, items = [], { site = null } = {}) {
  const url = site || await getCurrentSite()
    .catch(error => { throw Error(error.message) })
  return _crudListItems(listname, items, { op: 'New', site: url })
}
