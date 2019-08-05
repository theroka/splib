"use strict";

import { getCurrentSite } from "./../site";
import { _crudListItems } from "./crud";
import { SiteURL } from "../user/types";

/**
 * Update collection of list items in a Sharepoint list
 * @param {String} listname Name of Sharepoint list
 * @param {Object[]} items Item collection
 * @param {Object} [options]
 * @param {String} [options.site] URL to Sharepoint site. Default: current site
 */
export async function deleteItems(listname: string, items: Array<any> = [], site: SiteURL = null) {
  const siteUrl = site || (await getCurrentSite());
  return _crudListItems(listname, items, "Delete", siteUrl);
}
