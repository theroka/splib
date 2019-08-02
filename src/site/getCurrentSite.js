'use strict'

import { SharepointError } from './../utils'
import { _getOptions, _getEndpointUrl, _createSoapBody, _parseXML } from './../fetch'

const action = 'WebUrlFromPageUrl'
const options = _getOptions(action)

/**
 * Get URL of current Sharepoint site
 * @memberof module:Site
 * @alias module:Site.getCurrentSite
 * @return {Promise<String>} Returns URL of Sharepoint site
 *
 */
export async function getCurrentSite () {
  if (typeof window === "undefined") return // { throw Error('No window context available.') }
  const href = window.location.href || null
  const site = (window.location.href).split('/')
  const caml = `<pageUrl>${href}</pageUrl>`
  const body = _createSoapBody(action, caml)
  const url = _getEndpointUrl(action, site[0] + '//' + site[2])
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
