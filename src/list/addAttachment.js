'use strict'

import { SharepointError } from './../utils'
import { _getOptions, _getEndpointUrl, _createSoapBody, _parseXML } from './../fetch'
import { getCurrentSite } from './../site'

const action = 'AddAttachment'
const options = _getOptions(action)

/**
 * Add single base64 encoded attachment to item in Sharepoint list.
 * @memberof module:List
 * @alias module:List.addAttachment
 *
 * @param {String} listname Name of list.
 * @param {String|Number} itemID ID of list item.
 * @param {String} filename Filename.
 * @param {String} base64 Base64 encoded file to attach.
 * @param {Object} [options]
 * @param {String} [options.site] URL of Sharepoint site. Default: Current site.
 * @return {Promise}
 *
 * @example
 * const listname = 'name of list'
 * const filename = 'Filename.txt'
 * const base64 = encodeBase64(file) // --> "adf68a7df7...."
 *
 * addAttachment(listname, filename, base64)
 *     .then(response => console.log(response))
 *
 */
export async function addAttachment (listname, itemID, filename, base64, { site = null } = {}) {
  const siteUrl = site || await getCurrentSite()
    .catch(error => { throw Error(error.message) })

  const caml = `
    <listName>${listname}</listName>
    <listItemID>${itemID}</listItemID>
    <fileName>${filename}</fileName>
    <attachment>${base64}</attachment>`

  const body = _createSoapBody(action, caml)
  const url = _getEndpointUrl(action, siteUrl)

  return fetch(url, { ...options, body })
    .then(response => {
      if (!response.ok) { throw SharepointError(response, xml) }
      return response.text()
    })
    .then(xml => _parseXML(xml, action))
    .catch(err => { throw Error(err.message) })
}
