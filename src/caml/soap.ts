import { Namespace, CAML_NAMESPACE } from "./types"

/**
 * Generate stringified XML of Sharepoint CAML queries to send as SOAP over HTTP.
 * @param {String} action - Name Sharepoint webservice action to use in CAML
 * @param {String} caml - SOAP body content. Contains CAML query.
 * @param {String} [namespace=http://schemas.microsoft.com/sharepoint/soap/] - Overwrite default XML namespace. Default: null, no overwrite
 */
export function createSoapBody(action: string, caml: string, namespace: Namespace = null) {
  const xsi = "http://www.w3.org/2001/XMLSchema-instance";
  const xsd = "http://www.w3.org/2001/XMLSchema";
  const soap = "http://schemas.xmlsoap.org/soap/envelope/";
  const xmlns = namespace || CAML_NAMESPACE;
  const header = `<soap:Envelope xmlns:xsi="${xsi}" xmlns:xsd="${xsd}" xmlns:soap="${soap}">`;
  const body = `<soap:Body><${action} xmlns="${xmlns}">${caml}</${action}></soap:Body>`;
  return `${header}${body}</soap:Envelope>`;
}

/**
 * Create a CAML string for each item in passed item collection.
 * Each prop in every item is formatted as <Field prop>value</Field>
 */
export function generateItemCAML(items: Array<any>, operation: string) {
  return items.map(item => {
    const props = Object.keys(item);
    let fields: Array<string> = [];
    props.forEach(prop => {
      if (item[prop] != null) {
        if (prop.toLowerCase() == "id") {
          let id = operation.toLowerCase().trim() === "new" ? "New" : item[prop];
          fields.push(`<Field Name="ID">${id}</Field>`);
          return;
        }
        fields.push(`<Field Name="${prop}">${item[prop]}</Field>`);
      }
    });
    return fields.join("\n");
  });
}
