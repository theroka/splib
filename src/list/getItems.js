'use strict'

// local imports
import { createLog, _getDefaultFields, getFieldID, SharepointError } from './../utils'
import { _getOptions, _getEndpointUrl, _createSoapBody, _parseXML } from './../fetch'
import { getCurrentSite } from './../site'
import { checkFieldnames } from './../Request'
import { _castFieldsToProps } from './castFields'
import { getList } from './getList'

// constants
const log = createLog('list/GetListItems')
const action = 'GetListItems'
const fetchOptions = _getOptions(action)
const DEFAULT_ROWLIMIT = 5000
const queryOptions = {
  rowlimit: DEFAULT_ROWLIMIT,
  query: '',
}


/**
 * Get items from a Sharepoint list
 * @memberof module:List
 * @alias module:List.getItems
 *
 * @param {String} listname Name of Sharepoint list
 * @param {Object} [options]
 * @param {String} [options.site] URL to Sharepoint site
 * @return {Promise<Object[]>}
 *
 */
export async function getItems (listname, options) {
  // const opts = { ...queryOptions, ...options }

  if (!options.site) {
    options.site = await getCurrentSite()
  }
  const opts = { ...queryOptions, ...options }

  const list = await getList(listname, options.site)
  const fields = opts.fields ? opts.fields : _getDefaultFields(list.fields)
  const mappedFields = _mapFieldnames(list, fields)

  const viewfields = Object.keys(mappedFields)
    .map(id => `<FieldRef ID="${id}" Name="${mappedFields[id].name}"/>\n`)
    .join('')

  const caml = _generateGetItemsCAML(listname, opts.query, viewfields, { rowlimit: opts.rowlimit })
  const body = _createSoapBody(action, caml)
  const url = _getEndpointUrl(action, opts.site)

  return fetch(url, { ...fetchOptions, body })
    .then(response => {
      // @FIXME: Catch responses with status !== 200
      // if (!response.ok) { throw SharepointError(response, xml) }
      if (!response.ok) return ""
      return response.text()
    })
    .then(xml => _parseXML(xml, action, 'listitems.data.row', { asArray: true }))
    .then(items => {
      if (items.length > 0) {
        items = _castFieldsToProps(mappedFields, items, options)
      } else {
        items = null
      }
      return items
    })
    .catch(err => { throw Error(err.message) })
}


/**
 * @memberof module:List
 * @alias module:List._mapFieldnames
 * @private
 *
 * @param {Object} list
 * @param {Object} fields
 * @return {Object}
 */
function _mapFieldnames (list, fields) {
  let map = {}
  let names = Object.keys(fields)
  names.map(name => {
    const id = getFieldID(list.fields, name)
    if (id) {
      const f = list.fields.find(f => f.id === id)
      map[id] = { ...f, propName: fields[name]}
    }
  })
  return map
}


/**
 * @memberof module:List
 * @alias module:List._generateGetItemsCAML
 * @private
 *
 * @param {String} listname - Name of Sharepoint list
 * @param {String} [query=''] - Optional CAML query to filter result
 * @param {String} viewfields - String with FieldRef-Nodes to get specific fields from Sharepoint list
 * @param {Integer} [rowlimit=5000] - Limit of rows in response
 * @return {String} - Return CAML/XML string
 *
 */
function _generateGetItemsCAML (listname, query = '', viewfields, options) {
  const defaultOptions = {
    dateInUTC: true,
    includeAttachmentURL: true,
    includeMandatoryColumns: true,
    expandUserField: true,
    rowlimit: DEFAULT_ROWLIMIT,
  }

  options = { ...defaultOptions, ...options }

  return `
  <listName>${listname}</listName>
  <viewName></viewName>
  <query>
    <Query>
      ${query}
    </Query>
  </query>
  <viewFields>
    <ViewFields Properties='True'>
      ${viewfields}
    </ViewFields>
  </viewFields>
  <rowLimit>${options.rowlimit}</rowLimit>
  <queryOptions>
    <QueryOptions>
      <DateInUtc>${ options.dateInUTC ? 'TRUE' : 'FALSE' }</DateInUtc>
      <Paging ListItemCollectionPositionNext=""></Paging>
      <IncludeAttachmentsUrls>${ options.includeAttachmentURL ? 'TRUE' : 'FALSE' }</IncludeAttachmentsUrls>
      <IncludeMandatoryColumns>${ options.includeMandatoryColumns ? 'TRUE' : 'FALSE' }</IncludeMandatoryColumns>
      <ExpandUserField>${ options.expandUserField ? 'TRUE' : 'FALSE' }</ExpandUserField>
      <ViewAttributes Scope="Recursive"></ViewAttributes>
    </QueryOptions>
  </queryOptions>`
}
