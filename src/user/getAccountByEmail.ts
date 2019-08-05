"use strict";

import { SiteURL, Login, User } from "./types";
import { getOptions, endpointURL, createSoapBody, parser } from "./../caml";
import { getCurrentSite } from "./../site";

const ACTION = "GetUserLoginFromEmail";
const NAMESPACE = "http://schemas.microsoft.com/sharepoint/soap/directory/";

/**
 * Return profile of currently logged in Sharepoint user
 * Does not return full profile data - just Name, WorkPhone, Email and AccountName
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
  let login: Array<Login> = parser(xml, ACTION, "GetUserLoginFromEmail.User");

  let user: User = {
    name: login[0].DisplayName.trim(),
    email,
    login: login[0].Login.toLowerCase().trim()
  };

  return user;
}
