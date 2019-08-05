'use strict'

import { getCurrentSite } from './../site'
import { _crudListItems } from './crud'
import { SiteURL } from '../user/types';


/**
 * Update collection of list items in sharepoint list
 * @param {String} listname Name of Sharepoint list
 * @param {Object[]} items Collection of updated items
 * @param {Object} [options]
 * @param {String} [options.site] URL to Sharepoint site
 * @return {Promise&lt;Object[]&gt;}
 */
export async function updateItems (listname: string, items: Array<any> = [], site: SiteURL = null) {
  const siteUrl = site || (await getCurrentSite());
  return _crudListItems(listname, items, "Update", siteUrl);
}
