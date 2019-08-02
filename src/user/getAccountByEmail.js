'use strict'

import { createLog, SharepointError } from './../utils'
import { _getOptions, _getEndpointUrl, _createSoapBody, _parseXML } from './../fetch'
import { getCurrentSite } from './../site'

const log = createLog('user/getAccountByEmail')
const action = 'GetUserLoginFromEmail'
const namespace = 'http://schemas.microsoft.com/sharepoint/soap/directory/'
const options = _getOptions(action, namespace)

/**
 * Return profile of currently logged in Sharepoint user
 * Does not return full profile data - just Name, WorkPhone, Email and AccountName
 * @memberof module:User
 * @alias module:User.getAccountByEmail
 *
 * @param {string} site - URL of Sharepoint site
 * @return {Login} - User login
 * @return {Null} - Return null if user not found
 */
export async function getAccountByEmail (email, { site = null } = {}) {
  const siteUrl = site || await getCurrentSite()
    .catch(error => { throw Error(error.message) })
  const caml = `
    <emailXml>
      <Users>
        <User Email="${email}"/>
      </Users>
    </emailXml>`
  const body = _createSoapBody(action, caml, namespace)
  const url = _getEndpointUrl(action, siteUrl)

  return fetch(url, { ...options, body })
    .then(response => {
      if (!response.ok) { throw SharepointError(response, xml) }
      return response.text()
    })
    .then(xml => {
      const login = _parseXML(xml, action, 'GetUserLoginFromEmail.User')
      log.debug('Parsed login name.', login)
      const user = {
        name: login.DisplayName,
        email,
        login: login.Login.toLowerCase()
      }
      return login ? user : null
    })
    .catch(error => { throw Error(error.message) })
}
