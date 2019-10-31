"use strict";

import { getOptions, endpointURL, createSoapBody, parser } from '../caml'
import { getCurrentSite } from '../site'
import { SiteURL } from '../user/types';

const ACTION = 'GetAttachmentCollection';

/**
 * Get all attachments of a specific list item
 * @param {String} listname Name of Sharepoint list
 * @param {String|Number} itemID ID of list item
 * @param {String} [site] URL to Sharepoint site. Defaults to current site.
 * @return {Promise<String[]>}
 */
export async function getAttachments (listname: string, itemID: number, site: SiteURL = null) {
  const siteUrl = site || (await getCurrentSite());
  const caml = `
    <listName>${listname}</listName>
    <listItemID>${itemID}</listItemID>`;
  const body = createSoapBody(ACTION, caml);
  const url = endpointURL(ACTION, siteUrl);
  const options = getOptions(ACTION);

  let response = await fetch(url, { ...options, body });
  let xml = await response.text();
  let items: any = parser(xml, ACTION, "Attachments.Attachment");
  if (items.length === 1 && items[0] === '') items = null;

  return items;
}
