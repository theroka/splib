"use strict";

import { parser } from "./../caml";

export type StatusCode = number | string;

export interface SharepointFaultDeails {
  errorstring: string;
  errorcode: string;
}

/**
 * Parse and return error message in XML response from Sharepoint Webservices.
 * @param {Number|String} status - Response status code
 * @param {String} xml - Response XML string
 */
export function SharepointError(status: StatusCode, xml: string) {
  const fault: SharepointFaultDeails = parser(xml, "Fault.detail")[0];
  const error = {
    status,
    code: fault ? fault.errorcode : null,
    error: fault ? fault.errorstring : null
  };
  return new Error(JSON.stringify(error));
}
