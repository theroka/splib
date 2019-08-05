"use strict";

import { getCurrentSite } from "./../site";
import { getAccountByEmail } from "./getAccountByEmail";
import { getUser } from "./getUser";
import { SiteURL, User } from "./types";

/**
 * Return profile of currently logged in Sharepoint user
 * Does not return full profile data - just Name, WorkPhone, Email and AccountName
 * @param {String} site - URL of Sharepoint site
 * @return {Promise<User>} User profile
 * @return {Null} - Return null if user not found
 */
export async function getUserByEmail(email: string, site: SiteURL = null) {
  const siteUrl = site || (await getCurrentSite());
  const name: User = await getAccountByEmail(email, siteUrl);
  return name.login ? await getUser(name.login, siteUrl) : null;
}
