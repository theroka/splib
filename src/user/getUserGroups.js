'use strict'

import { SharepointError } from './../utils'
import { _getOptions, _getEndpointUrl, _createSoapBody, _parseXML } from './../fetch'
import { getCurrentSite } from './../site'

const action = 'GetGroupCollectionFromUser'
const namespace = 'http://schemas.microsoft.com/sharepoint/soap/directory/'
const options = _getOptions(action, namespace)


/**
 * Get groups of specific user
 * @memberof module:User
 * @alias module:User.getUserGroups
 *
 * @param {String} login
 * @param {Object} [options]
 * @param {Object} [options.site] - URL of Sharepoint site
 */
export async function getUserGroups (login = '', { site = null } = {}) {
  const siteUrl = site || await getCurrentSite()
    .catch(error => { throw Error(error.message) })
  const caml = `<userLoginName>${login.trim()}</userLoginName>`
  const body = _createSoapBody(action, caml, namespace)
  const url = _getEndpointUrl(action, siteUrl)

  return fetch(url, { ...options, body })
    .then(response => {
      if (!response.ok) { throw SharepointError(response, xml) }
      return response.text()
    })
    .then(xml => _parseXML(xml, action, null, { asArray: true }))
    .catch(error=> { throw Error(error.message) })
}
