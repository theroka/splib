'use strict'

import { createLog, SharepointError } from './../utils'
import { _getOptions, _getEndpointUrl, _createSoapBody, _parseXML } from './../fetch'
import { getCurrentSite } from './../site'

const log = createLog('list/GetList')
const action = 'GetList'
const options = _getOptions(action)


/**
 * Get all field definitions of a Sharepoint list
 * @memberof module:List
 * @alias module:List.getList
 *
 * @param {String} listname Name of Sharepoint list
 * @param {Object} [options]
 * @param {String} [options.site] URL to Sharepoint list
 * @return {Promise<Object>}
 *
 */
export async function getList (listname, site = null) {
  const siteUrl = site || await getCurrentSite()
    .catch(error => { throw Error(error.message) })
  const caml = `<listName>${listname}</listName>`
  const body = _createSoapBody(action, caml)
  const url = _getEndpointUrl(action, siteUrl)

  return fetch(url, { ...options, body })
    .then(response => {
      if (!response.ok) { throw SharepointError(response, xml) }
      return response.text()
    })
    .then(xml => _parseGetListResult(xml, action))
    .catch(err => { throw Error(err.message) })
}



function _parseGetListResult (xml, action) {
  let props = _parseXML(xml, action, 'List')

  let fields = props.Fields.Field.slice().map(function (field) {
    const id = field.ID
    const type = field.Type.toLowerCase()
    const displayName = field.DisplayName
    const staticName = field.StaticName
    const name = field.Name
    const required = field.Required === 'TRUE' || false
    const dateOnly = field.Format === 'DateOnly' || false
    const hidden = field.Hidden === 'TRUE' || false
    return { id, type, displayName, staticName, name, required, hidden, dateOnly }
  })

  return {
    id: props.ID,
    title: props.Title.trim(),
    description: props.Description.trim(),
    created: _parseTimestamp(props.Created),
    modified: _parseTimestamp(props.Modified),
    defaultView: props.DefaultViewUrl,
    allowAttachments: props.EnableAttachments === 'True' ? true : false,
    allowFolders: props.EnableFolderCreation === 'True' ? true : false,
    allowModeration: props.EnableModeration === 'True' ? true : false,
    allowVersioning: props.EnableVersioning === 'True' ? true : false,
    allowMinorVersioning: props.EnableMinorVersion === 'True' ? true : false,
    itemsCount: parseInt(props.ItemCount),
    fields
  }
}


function _parseTimestamp (datetimeString) {
  const s = datetimeString.split(' ')
  const y = s[0]
  const t = s[1].split(':')
  const yy = parseInt(s[0].slice(0, 4))
  const ym = parseInt(s[0].slice(4).slice(0, 2))
  const yd = parseInt(s[0].slice(6))
  const th = parseInt(t[0])
  const tm = parseInt(t[1])
  const ts = parseInt(t[2])
  let d = new Date()
  d.setUTCDate(yy)
  d.setUTCMonth(ym)
  d.setUTCFullYear(yd)
  d.setUTCHours(th)
  d.setUTCMinutes(tm)
  d.setUTCSeconds(ts)
  return d
}
