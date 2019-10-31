"use strict";

import { unescapeSharepointText } from "../utils";
import { getOptions, endpointURL, createSoapBody, parser } from "../caml";
import { getCurrentSite } from "../site";
import { SiteURL, StringMap, Properties } from "./types";

// constants
const ACTION = "GetUserProfileByName";
const NAMESPACE =
  "http://microsoft.com/webservices/SharePointPortalServer/UserProfileService";

const UserFields: StringMap = {
  FirstName: "firstName",
  LastName: "lastName",
  WorkEmail: "workEmail",
  WorkPhone: "workPhone",
  CellPhone: "cellPhone",
  HomePhone: "homePhone",
  Department: "department",
  Company: "company",
  AccountName: "account",
  UserName: "username",
  WebSite: "websiteURL",
  PictureURL: "thumbnail",
  Gender: "gender"
};

/**
 * Get profile of user by account name
 * @param {String} username=null - User account name, e.g. SHAREPPROD\\a1b2c3d4e5
 * @param {String} [site] URL of Sharepoint site. Defaults to current site.
 * @return {User} User profile
 */
export async function getUser(username: string, site: SiteURL = null) {
  const siteUrl = site || (await getCurrentSite());
  const caml = `<AccountName>${username || ""}</AccountName>`;
  const body = createSoapBody(ACTION, caml, NAMESPACE);
  const url = endpointURL(ACTION, siteUrl);
  const options = getOptions(ACTION, NAMESPACE);

  let response = await fetch(url, { ...options, body });
  let xml = await response.text();
  let data = parser(xml, ACTION, "PropertyData");

  let props: Properties = {};
  data.map((prop: any) => (props[prop.Name] = prop.Values.ValueData.Value));

  let profile: Properties = {};

  // @see: https://stackoverflow.com/a/41765723/3608062
  for (const key in UserFields) {
    const propName: string = UserFields[key];
    let value = props[propName] || null;
    profile[propName] = unescapeSharepointText(value)
  }

  return profile;
}

/**
 * Get profile data of current logged in Sharepoint user.
 * @return {Object} - User profile data
 */
export async function getCurrentUser() {
  return await getUser("");
}
