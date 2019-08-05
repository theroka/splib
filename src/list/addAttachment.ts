"use strict";

import { SharepointError } from "./../utils";
import { getOptions, endpointURL, createSoapBody, parser } from "./../caml";
import { getCurrentSite } from "./../site";
import { SiteURL } from "../user/types";

const ACTION = "AddAttachment";

/**
 * Add single base64 encoded attachment to item in Sharepoint list.
 * @param {String} listname Name of list.
 * @param {String|Number} itemID ID of list item.
 * @param {String} filename Filename.
 * @param {String} base64 Base64 encoded file to attach.
 * @param {Object} [options]
 * @param {String} [options.site] URL of Sharepoint site. Default: Current site.
 * @return {Promise}
 */
export async function addAttachment(
  listname: string,
  itemID: number,
  filename: string,
  base64: string,
  site: SiteURL = null
) {
  const siteUrl = site || (await getCurrentSite());
  const caml = `
    <listName>${listname}</listName>
    <listItemID>${itemID}</listItemID>
    <fileName>${filename}</fileName>
    <attachment>${base64}</attachment>`;
  const body = createSoapBody(ACTION, caml);
  const url = endpointURL(ACTION, siteUrl);
  const options = getOptions(ACTION);

  let response = await fetch(url, { ...options, body });
  let xml = await response.text();
  let data = parser(xml, ACTION);

  return data
}
