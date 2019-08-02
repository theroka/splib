'use strict'

import { createLog } from './../utils'
import { getCurrentSite } from './../site'
import { getAccountByEmail } from './getAccountByEmail'
import { getUser } from './getUser'

const log = createLog('user/getUserByEmail')


/**
 * Return profile of currently logged in Sharepoint user
 * Does not return full profile data - just Name, WorkPhone, Email and AccountName
 * @memberof module:User
 * @alias module:User.getUserByEmail
 *
 * @param {String} site - URL of Sharepoint site
 * @return {Promise<User>} User profile
 * @return {Null} - Return null if user not found
 */
export async function getUserByEmail (email, { site = null } = {}) {
  log.debug('Get login name by email.', email)
  const siteUrl = site || await getCurrentSite()
    .catch(error => { throw Error(error.message) })
  const name = await getAccountByEmail(email, siteUrl)
  log.debug('Get login name successfully.', name)
  return name ? getUser(name.login, siteUrl) : null
}
