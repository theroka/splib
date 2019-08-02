'use strict'

import { SharepointError } from './../utils'
import { _getOptions, _getEndpointUrl, _createSoapBody, _parseXML } from './../fetch'
import { getCurrentSite } from './../site'

const action = 'GetUserMemberships'
const namespace = 'http://microsoft.com/webservices/SharePointPortalServer/UserProfileService/'
const options = _getOptions(action, namespace)


/**
 * Return profile of currently logged in Sharepoint user
 * Does not return full profile data - just Name, WorkPhone, Email and AccountName
 * @memberof module:User
 * @alias module:User.getMemberships
 *
 * @param {string} site - URL of Sharepoint site
 * @return {Object} - User profile data
 */
export async function getMemberships (accountName = '', { site = null } = {}) {
  const siteUrl = site || await getCurrentSite()
    .catch(error => { throw Error(error.message) })
  const caml = `<accountName>${accountName.trim()}</accountName>`
  const body = _createSoapBody(action, caml, namespace)
  const url = _getEndpointUrl(action, siteUrl)

  return fetch(url, { ...options, body })
    .then(response => {
      if (!response.ok) { throw SharepointError(response, xml) }
      return response.text()
    })
    .then(xml => _parseXML(xml, action, 'MembershipData', { asArray: true }))
    .catch(error => { throw Error(error.message) })
}
