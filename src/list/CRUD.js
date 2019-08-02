'use strict'

import { createLog, chunkArray, getFieldID } from './../utils'
import { _getOptions, _getEndpointUrl, _createSoapBody, _parseXML } from './../fetch'
import {
  _createBoolean,
  _createMultiChoice,
  _createDatetimeUTC,
  _createInteger,
  _createLookup,
  _createMultiLookup,
  _createNote,
  _createPerson,
  _createText
} from './../types'
import { getCurrentSite } from './../site'
import { getList } from './getList'

const log = createLog('list/CRUD')
const action = 'UpdateListItems'
const options = _getOptions(action)


/**
 * Add new items to a Sharepoint list.
 * If you pass items with propertyX = null, these fields will be set to "" (empty CAML string).
 * @memberof module:List
 * @alias module:List._crudListItems
 * @private
 *
 * @param {String} listname
 * @param {Object[]} items
 * @param {Object} [options]
 * @param {String} [options.site=null]
 * @param {String} [options.op='New']
 * @return {Promise<Object[]>}
 */
export async function _crudListItems (listname, items = [], { site = null, op = 'New' } = {}) {
  log.debug('CRUD item:', items, 'operation:', op)
  const siteUrl = site || await getCurrentSite()
    .catch(error => { throw Error(error.message) })
  const list = await getList(listname, siteUrl)
  log.debug('Got fields of list', listname, 'fields:', list.fields)

  // preprocess items
  const mappedItems = _mapPropsToFields(items.slice(), list.fields)
  log.debug('Prop/Field mapped items:', mappedItems)
  const castedItems = _typePropValues(mappedItems, list.fields)
  op = op.charAt(0).toUpperCase() + op.slice(1)
  log.debug('Casted items:', castedItems)
  const camlItems = _generateItemCaml(castedItems, op)
  log.debug('CAML for items created', camlItems)
  const chunkedItems = chunkArray(camlItems.slice(), 160)

  const batches = chunkedItems.map(chunk => {
    const items = chunk.map((item, index) => {
      return `
        <Method ID="${index + 1}" Cmd="${op}">
          ${item}
        </Method>`
    })
    return items.join('\n')
  })

  const camlBodies = batches.map(batch => {
    return _createSoapBody(
      'UpdateListItems',
      `<listName>${listname}</listName>
      <updates>
        <Batch OnError="Continue">
          ${batch}
        </Batch>
      </updates>`
    )
  })

  let requests = camlBodies.map(body => {
    const url = _getEndpointUrl(action, siteUrl)
    return fetch(url, { ...options, body })
      .then(response => response.text())
      .then(xml => _parseXML(xml, action, 'Results.Result', { asArray: true }))
      .then(results => results.map(r => r.row))
      .catch(err => { throw Error(err.message) })
  })

  return Promise.all(requests)
    .then(responses => [].concat.apply([], responses))
}


/**
 * Return item collection where props names are changed with
 * the field IDs of the Sharepoint list.
 * A collection item only contains ID props where original props
 * names and field names are matching.
 * Item props which does not match with any field of the list are omitted.
 * @memberof module:List
 * @alias module:List._mapPropsToFields
 * @private
 *
 * @param {Object[]} items - Items collection to map
 * @param {Object[]} fields - List fields collection
 * @return {Object[]} Mapped items collection
 *
 * @TODO: Add option, to omit computed/calculated field on creating or updating list items.
 */
function _mapPropsToFields (items, fields) {
  return items.map(item => {
    const props = Object.keys(item)
    const mapped = {}
    props.forEach(prop => {
      const id = getFieldID(fields, prop)
      if (id) {
        const name = fields.find(f => f.id === id).name
        mapped[name] = item[prop]
      }
    })
    return mapped
  })
}


/**
 * Cast prop values of mapped item collection into Sharepoint types.
 * On the JS side, all casted prop values are typed as string.
 * @memberof module:List
 * @alias module:List._typePropValues
 * @private
 */
function _typePropValues (items, fields) {
  const typed = items.map(item => {
    const names = Object.keys(item)
    const spType = n => fields.find(f => f.name === n).type || null
    const casted = {}
    // @TODO: Add more type conversions.
    names.forEach(name => {
        switch (spType(name)) {
          case 'counter':
          case 'integer':
            casted[name] = _createInteger(item[name])
            break
          case 'text':
            casted[name] = _createText(item[name])
            break
          case 'note':
            casted[name] = _createNote(item[name])
            break
          case 'boolean':
            casted[name] = _createBoolean(item[name])
            break
          case 'datetime':
            casted[name] = _createDatetimeUTC(item[name], f.dateOnly)
            break
          case 'person':
            casted[name] = _createPerson(item[name])
            break
          case 'multichoice':
            casted[name] = _createMultiChoice(item[name])
            break
          case 'lookup':
            casted[name] = _createLookup(item[name])
            break
          case 'lookupmulti':
            casted[name] = _createMultiLookup(item[name])
            break
          default:
            casted[name] = _createText(item[name])
        }
    })
    return casted
  })
  log.debug('typePropValues()', typed)
  return typed
}


/**
 * Create a CAML string for each item in passed item collection.
 * Each prop in every item is formatted as <Field prop>value</Field>
 * @memberof module:List
 * @alias module:List._generateItemCaml
 * @private
 */
function _generateItemCaml (items, op) {
  return items.map(item => {
    const props = Object.keys(item)
    let fields = []
    props.forEach(prop => {
      if (item[prop] != null) {
        if (prop.toLowerCase() == 'id') {
          const id = op.toLowerCase() === 'new' ? 'New' : item[prop]
          fields.push(`<Field Name="ID">${id}</Field>`)
          return
        }
        fields.push(`<Field Name="${prop}">${item[prop]}</Field>`)
      }
    })
    return fields.join('\n')
  })
}
