'use strict'

import { _parseXML } from './../fetch'

/**
 * Parse and return error message in XML response from Sharepoint Webservices.
 * @memberof module:Utils
 * @alias module:Utils.SharepointError
 *
 * @param {Object} response
 * @param {String} xml
 */
export function SharepointError (response, xml) {
  if (!response.ok) {
    const fault = _parseXML(xml, 'Fault').Fault
    const error = {
      sharepointStatus: response.status,
      sharepointError: fault ? fault.detail.errorstring : null
    }
    return Error(JSON.stringify(error))
  }
}
