'use strict'

// local imports
import { createLog, SharepointError, unescapeSharepointText } from './../utils'
import { _getOptions, _getEndpointUrl, _createSoapBody, _parseXML } from './../fetch'
import { getCurrentSite } from './../site'

// constants
const log = createLog('user/GetUserProfileByName')
const action = 'GetUserProfileByName'
const namespace = 'http://microsoft.com/webservices/SharePointPortalServer/UserProfileService/'
const options = _getOptions(action, namespace)

const mappedUserFields = {
  'FirstName': 'firstName',
  'LastName': 'lastName',
  'WorkEmail': 'workEmail',
  'WorkPhone': 'workPhone',
  'CellPhone': 'cellPhone',
  'HomePhone': 'homePhone',
  'Department': 'department',
  'Company': 'company',
  'AccountName': 'account',
  'UserName': 'username',
  'WebSite': 'websiteURL',
  'PictureURL': 'thumbnail',
  'Gender': 'gender',
}


/**
 * Get profile of user by account name
 * @memberof module:User
 * @alias module:User.getUser
 *
 * @param {String} username=null - User account name, e.g. SHAREPPROD\\a1b2c3d4e5
 * @param {Object} [options]
 * @param {String} [options.site] URL of Sharepoint site
 * @return {User} User profile
 *
 * @example
 * sharepoint.getUser('domain\\username')
 *     .then(user => console.log(user)) // --> { firstName, lastName, email, ... }
 */
export async function getUser (username = null, { site = null } = {}) {
  log.debug('Get profile by username:', username)
  const siteUrl = site || await getCurrentSite()
    .catch(error => { throw Error(error.message) })
  const caml = `<AccountName>${username || ''}</AccountName>`
  // remove last trailing slash from namespace, since SP return your profile only
  // if you do not remove the trailing slash
  const ns = namespace.substring(0, namespace.length - 1)
  const body = _createSoapBody(action, caml, ns)
  const url = _getEndpointUrl(action, siteUrl)

  return await fetch(url, { ...options, body })
    .then(response => {
      if (!response.ok) { throw SharepointError(response, xml) }
      return response.text()
    })
    .then(xml => _parseUserProfile(xml))
    .catch(error => { throw Error(error.message) })
}


function _parseUserProfile (xml) {
  const properties = _parseXML(xml, 'GetUserProfileByName', 'PropertyData')
  log.debug('Parsed properties:', properties)
  const values = {}
  properties.map(prop => {
    if (
      prop.Values != ''
      && (typeof prop.Values === 'object')
    ) {
      values[prop.Name] = prop.Values.ValueData.Value
    }
  })
  log.debug('Selected values:', values)

  // @see: https://stackoverflow.com/a/41765723/3608062
  const profile = Object.keys(mappedUserFields).reduce((result, key) => {
    const mappedName = mappedUserFields[key]
    if (values[key]) {
      result[mappedName] = unescapeSharepointText(values[key]['#text']) || null
    } else {
      result[mappedName] = null
    }
    return result;
  }, {})

  log.debug('Get profile by username successfully.', profile)
  return profile
}


/**
 * Get profile data of current logged in Sharepoint user.
 * @memberof module:User
 * @alias module:User.getCurrentUser
 *
 * @return {Object} - User profile data
 *
 * @example
 * sharepoint.getCurrentUser()
 *     .then(user => console.log(user)) // --> { firstName, lastName, email, ... }
 *
 * sharepoint.getUser(null)
 *     .then(user => console.log(user)) // --> { firstName, lastName, email, ... }
 */
export async function getCurrentUser () {
  return await getUser(null)
}
