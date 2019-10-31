"use strict";

import { parser } from "../caml";

export type StatusCode = number | string;

export interface SharepointFaultDetails {
  errorString: string;
  errorCode: string;
}

/**
 * Parse and return error message in XML response from Sharepoint Webservices.
 * @param {Number|String} status - Response status code
 * @param {String} xml - Response XML string
 */
export function SharepointError(status: StatusCode, xml: string) {
  const fault: SharepointFaultDetails = parser(xml, "Fault.detail")[0];
  const error = {
    status,
    code: fault ? fault.errorCode : null,
    error: fault ? fault.errorString : null
  };
  return new Error(JSON.stringify(error));
}
