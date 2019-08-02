'use strict'

/**
 * @module Fetch
 * @private
 */

export { _parseXML } from './parseXML'

// constants
const DEFAULT_CAML_NAMESPACE = 'http://schemas.microsoft.com/sharepoint/soap/'
const CAML_ACTIONS = {
  GetList: 'Lists',
  GetListItems: 'Lists',
  UpdateListItems: 'Lists',
  GetAttachmentCollection: 'Lists',
  AddAttachment: 'Lists',
  DeleteAttachment: 'Lists',
  GetPermissionCollection: 'Permissions',
  GetRoleCollectionFromUser: 'UserGroup',
  GetGroupCollectionFromUser: 'UserGroup',
  GetRolesAndPermissionsForCurrentUser: 'UserGroup',
  GetUserLoginFromEmail: 'UserGroup',
  GetUserProfileByName: 'UserProfileService',
  GetUserMemberships: 'UserProfileService',
  WebUrlFromPageUrl: 'Webs',
}


/**
 * Returns object with default options and HTTP headers to use with Fetch API
 * for sending CAML queries to Sharepoint Webservices.
 * @memberof module:Fetch
 * @alias module:Fetch._getOptions
 * @private
 *
 * @param {String} action - Action to call from Sharepoint Webservice
 * @param {String} namespace=http://schemas.microsoft.com/sharepoint/soap/ - Set default XML namespace used in CAML request
 * @return {Object}
 */
export function _getOptions (action, namespace = DEFAULT_CAML_NAMESPACE) {
  if (action === null || action === '' || action == undefined) {
    throw Error('Cannot get options for fetch request.')
  }
  const headers = new Headers({
    'accept': 'text/xml',
    'content-type': 'text/xml; charset=utf-8',
    'SOAPAction': namespace + action // without this you'll get an HTTP 500
  })
  return {
    method: 'post',
    credentials: 'include',
    headers
  }
}


/**
 * Get webservice endpoint for specific Sharepoint webservice action.
 * @memberof module:Fetch
 * @alias module:Fetch._getEndpointUrl
 * @private
 *
 * @param {String} action - Name of webservice action.
 * @param {String} site - URL of (current) Sharepoint site.
 * @return {String}
 */
export function _getEndpointUrl (action, site) {
  return site + '/_vti_bin/' + CAML_ACTIONS[action] + '.asmx'
}


/**
 * Generate stringified XML of Sharepoint CAML queries to send as SOAP over HTTP.
 * @memberof module:Fetch
 * @alias module:Fetch._createSoapBody
 * @private
 *
 * @param {String} action - Name Sharepoint webservice action to use in CAML
 * @param {String} caml - SOAP body content. Contains CAML query.
 * @param {String} namespace - Overwrite default XML namespace. Default: null, no overwrite
 */
export function _createSoapBody (action, caml, namespace = null) {
  const xsi = 'http://www.w3.org/2001/XMLSchema-instance'
  const xsd = 'http://www.w3.org/2001/XMLSchema'
  const soap = 'http://schemas.xmlsoap.org/soap/envelope/'
  const xmlns = namespace || 'http://schemas.microsoft.com/sharepoint/soap/'
  const header = `<soap:Envelope xmlns:xsi="${xsi}" xmlns:xsd="${xsd}" xmlns:soap="${soap}">`
  const body = `<soap:Body><${action} xmlns="${xmlns}">${caml}</${action}></soap:Body>`
  return `${header}${body}</soap:Envelope>`
}
