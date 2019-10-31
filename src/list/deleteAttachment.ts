"use strict";

import {createSoapBody, endpointURL, getOptions, parser} from "../caml";
import {getCurrentSite} from "../site";
import {SiteURL} from "../user/types";

const ACTION = "DeleteAttachment";

/**
 * Delete attachment from Sharepoint list item by passing item ID and URL to attached file.
 * @param {String} listname Name of Sharepoint list
 * @param {String|Number} itemID ID of list item
 * @param {String} attachmentUrl Remote file URL attached to list item
 * @param {String} [site] URL of Sharepoint site. Defaults to current site.
 * @return {Promise}
 */
export async function deleteAttachment(
  listname: string,
  itemID: number,
  attachmentUrl: string,
  site: SiteURL = null
) {
  const siteUrl = site || (await getCurrentSite());
  const caml = `
    <listName>${listname}</listName>
    <listItemID>${itemID}</listItemID>
    <url>${attachmentUrl}</url>`;
  // @TODO: Check how complete url has to look like
  const body = createSoapBody(ACTION, caml);
  const url = endpointURL(ACTION, siteUrl);
  const options = getOptions(ACTION);

  let response = await fetch(url, { ...options, body });
  let xml = await response.text();
  return parser(xml, ACTION);
}
