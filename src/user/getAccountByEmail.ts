"use strict";

import { SiteURL, Login, User } from "./types";
import { getOptions, endpointURL, createSoapBody, parser } from "../caml";
import { getCurrentSite } from "../site";

const ACTION = "GetUserLoginFromEmail";
const NAMESPACE = "http://schemas.microsoft.com/sharepoint/soap/directory/";

/**
 * Return profile of currently logged in Sharepoint user
 * Does not return full profile data - just Name, WorkPhone, Email and AccountName
 * @param {String} email - Email of account to get profile from.
 * @param {string} site - URL of Sharepoint site
 * @return {Login} - User login
 * @return {Null} - Return null if user not found
 */
export async function getAccountByEmail(
  email: string,
  site: SiteURL = null
): Promise<User> {
  const siteUrl = site || (await getCurrentSite());
  const caml = `
    <emailXml>
      <Users>
        <User Email="${email}"/>
      </Users>
    </emailXml>`;
  const body = createSoapBody(ACTION, caml, NAMESPACE);
  const url = endpointURL(ACTION, siteUrl);
  const options = getOptions(ACTION, NAMESPACE);

  let response = await fetch(url, { ...options, body });
  let xml = await response.text();
  let profile: Array<Login> = parser(xml, ACTION, "GetUserLoginFromEmail.User");

  const { DisplayName, Login } = profile[0];

  return {
    name: DisplayName.trim(),
    email,
    login: Login.toLowerCase().trim()
  };
}
