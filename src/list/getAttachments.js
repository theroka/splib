'use strict'

/* Imports */

import { SharepointError } from './../utils'
import { _getOptions, _getEndpointUrl, _createSoapBody, _parseXML } from './../fetch'
import { getCurrentSite } from './../site'

const action = 'GetAttachmentCollection'
const options = _getOptions(action)


/**
 * Get all attachments of a specific list item
 * @memberof module:List
 * @alias module:List.getAttachments
 *
 * @param {String} listname Name of Sharepoint list
 * @param {String|Number} itemID ID of list item
 * @param {Object} [options]
 * @param {String} [options.site] URL to Sharepoint site. Default: current site
 * @return {Promise<String[]>}
 */
export async function getAttachments (listname, itemID, { site = null } = {}) {
  const siteUrl = site || await getCurrentSite()
    .catch(error => { throw Error(error.message) })

  const caml = `
    <listName>${listname}</listName>
    <listItemID>${itemID}</listItemID>`

  const body = _createSoapBody(action, caml)
  const url = _getEndpointUrl(action, siteUrl)

  return fetch(url, { ...options, body })
    .then(response => {
      if (!response.ok) { throw SharepointError(response, xml) }
      return response.text()
    })
    .then(xml => {
      let items = _parseXML(xml, action, 'Attachments.Attachment', { asArray: true })
      if (items.length === 1 && items[0] === '') items = null
      return items
    })
    .catch(err => { throw Error(err.message) })
}
