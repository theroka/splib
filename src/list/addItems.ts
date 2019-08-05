"use strict";

import { getCurrentSite } from "./../site";
import { _crudListItems } from "./crud";
import { SiteURL } from "../user/types";

/**
 * Add items to Sharepoint list.
 * Pass items as object collection. The item property names are matched
 * to the fields of the Sharepoint list.
 * You can use the display names, static or
 * system names of the Sharepoint list as item properties.
 * @param {String} listname Name of Sharepoint list
 * @param {Object[]} items Item collection to add to Sharepoint list.
 * @param {Object} [options]
 * @property {String} [options.site] URL of Sharepoint site. Default: Current site.
 */
export async function addItems(listname: string, items: Array<any> = [], site: SiteURL = null) {
  const siteUrl = site || (await getCurrentSite());
  return _crudListItems(listname, items, "New", siteUrl);
}
