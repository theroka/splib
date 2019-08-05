import { CAML_NAMESPACE } from "./types";

/**
 * Returns object with default options and HTTP headers to use with Fetch API
 * for sending CAML queries to Sharepoint Webservices.
 * @param {String} action - Action to call from Sharepoint Webservice
 * @param {String} [namespace=http://schemas.microsoft.com/sharepoint/soap/] - Set default XML namespace used in CAML request
 * @return {Object}
 */
export function getOptions(
  action: string,
  namespace: string = CAML_NAMESPACE
): RequestInit {
  if (action === null || action === "" || action == undefined) {
    throw Error("Cannot get options for fetch request.");
  }
  const headers = new Headers({
    accept: "text/xml",
    "content-type": "text/xml; charset=utf-8",
    SOAPAction: namespace + action // without this you'll get an HTTP 500
  });
  return {
    method: "post",
    credentials: "include",
    headers
  };
}
