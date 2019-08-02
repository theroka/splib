'use strict'

import { SharepointError } from './../utils'
import { _getOptions, _getEndpointUrl, _createSoapBody, _parseXML} from './../fetch'
import { getCurrentSite } from './../site'

const action = 'DeleteAttachment'
const options = _getOptions(action)


/**
 * Delete attachment from Sharepoint list item by passing item ID and URL to attached file.
 * @memberof module:List
 * @alias module:List.deleteAttachment
 *
 * @param {String} listname Name of Sharepoint list
 * @param {String|Number} itemID ID of list item
 * @param {String} attachmentUrl Remote file URL attached to list item
 * @param {Object} [options] Optional
 * @param {String} [options.site] URL of Sharepoint site
 * @return {Promise}
 */
export async function deleteAttachment (listname, itemID, attachmentUrl, { site = null } = {}) {
  const siteUrl = site || await getCurrentSite()
    .catch(error => { throw Error(error.message) })

  const caml = `
    <listName>${listname}</listName>
    <listItemID>${itemID}</listItemID>
    <url>${fullUrl}</url>`

  const body = _createSoapBody(action, caml)
  const url = _getEndpointUrl(action, siteUrl)
  // const response = await fetch(url, { ...options, body })
  //   .catch(err => { throw Error(err.message) })
  // const xml = await response.text()

  // if (!response.ok) { throw SharepointError(response, xml) }

  // return _parseXML(xml, action)

  return fetch(url, { ...options, body })
    .then(response => {
      if (!response.ok) { throw SharepointError(response, xml) }
      return response.text()
    })
    .then(xml => _parseXML(xml, action))
    .catch(err => { throw Error(err.message) })
}
