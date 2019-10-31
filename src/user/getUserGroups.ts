"use strict";

import {createSoapBody, endpointURL, getOptions, parser} from "../caml";
import {getCurrentSite} from "../site";
import {SiteURL} from "./types";

const ACTION = "GetGroupCollectionFromUser";
const NAMESPACE = "http://schemas.microsoft.com/sharepoint/soap/directory/";
const options = getOptions(ACTION, NAMESPACE);

/**
 * Get groups of specific user
 * @param {String} login
 * @param {Object} [site] - URL of Sharepoint site
 */
export async function getUserGroups(login: string, site: SiteURL = null) {
  const siteUrl = site || (await getCurrentSite());
  const caml = `<userLoginName>${login.trim()}</userLoginName>`;
  const body = createSoapBody(ACTION, caml, NAMESPACE);
  const url = endpointURL(ACTION, siteUrl);
  const options = getOptions(ACTION, NAMESPACE);

  let response = await fetch(url, { ...options, body });
  let xml = await response.text();
  return parser(xml, ACTION);
}
