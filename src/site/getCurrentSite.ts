"use strict";

import { getOptions, endpointURL, createSoapBody, parser } from "../caml";

const GET_CURRENT_SITE_ACTION = "WebUrlFromPageUrl";

/**
 * Get URL of current Sharepoint site
 * @return {Promise<String>} Returns URL of Sharepoint site
 */
export async function getCurrentSite(): Promise<any> {
  if (typeof window === "undefined") return null; // { throw Error('No window context available.') }
  const href = window.location.href || null;
  const site = window.location.href.split("/");
  const caml = `<pageUrl>${href}</pageUrl>`;
  const body = createSoapBody(GET_CURRENT_SITE_ACTION, caml);
  const url = endpointURL(GET_CURRENT_SITE_ACTION, site[0] + "//" + site[2]);
  const options = getOptions(GET_CURRENT_SITE_ACTION);

  let response = await fetch(url, { ...options, body });
  if (!response.ok) return null;
  let xml = await response.text();

  return parser(xml, GET_CURRENT_SITE_ACTION)
}
