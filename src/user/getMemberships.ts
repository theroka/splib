"use strict";

import { SiteURL, Login, User } from "./types";
import { getOptions, endpointURL, createSoapBody, parser } from "./../caml";
import { getCurrentSite } from "./../site";

const ACTION = "GetUserMemberships";
const NAMESPACE =
  "http://microsoft.com/webservices/SharePointPortalServer/UserProfileService/";

/**
 * Return profile of currently logged in Sharepoint user
 * Does not return full profile data - just Name, WorkPhone, Email and AccountName
 * @param {string} site - URL of Sharepoint site
 * @return {Object} - User profile data
 */
export async function getMemberships(accountName: string, site: SiteURL = null) {
  const siteUrl = site || (await getCurrentSite());
  const caml = `<accountName>${accountName.trim()}</accountName>`;
  const body = createSoapBody(ACTION, caml, NAMESPACE);
  const url = endpointURL(ACTION, siteUrl);
  const options = getOptions(ACTION, NAMESPACE);

  let response = await fetch(url, { ...options, body });
  let xml = await response.text()
  let data = parser(xml, ACTION, "MembershipData");

  return data
}
