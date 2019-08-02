'use strict'

// local imports
import { parse } from 'date-fns';
import { createLog } from './../utils'
import { unescapeSharepointText } from './../utils'
import {
  _parseCalculated,
  _parseMultiChoice,
  _parseDatetimeUTC,
  _parseLookup,
  _parseMultiLookup,
  _parseUser,
  _parseMultiUser,
  _parseUrl
} from './../types'

// constants
const log = createLog('list/castFields')


export function _castFieldsToProps (mappedFields, items, options) {
  if (items.length == 0) return null
  const fields = Object.keys(mappedFields).map(id => mappedFields[id])
  const includeLookupValue = options.includeLookupValue || false

  let castedItems = items.map(item => {
    let mappedItem = {}
    fields.forEach(f => {
      let prop = false
      const attrName = 'ows_' + f.name
      const staticAttrName = 'ows_' + f.staticName
      switch (true) {
        case item[attrName] !== undefined:
          prop = attrName
          break
        case item[staticAttrName] !== undefined:
          prop = staticAttrName
          break
        case item[f.displayName] !== undefined:
          prop = f.displayName
          break
        default:
          mappedItem[f.propName] = null
      }
      if (prop) {
        switch (f.type) {
          case 'text':
          case 'note':
          case 'choice':
            mappedItem[f.propName] = unescapeSharepointText(item[prop])
            break
          case 'integer':
          case 'counter':
            mappedItem[f.propName] = parseInt(item[prop])
            break
          case 'number':
            mappedItem[f.propName] = parseFloat(item[prop])
            break
          case 'boolean':
            mappedItem[f.propName] = (item[prop] == 1 ? true : false)
            break
          case 'calculated':
            mappedItem[f.propName] = _parseCalculated(item[prop])
            break
          case 'datetime':
            // @NOTE: expects that datetime string from Sharepoint is formatted as UTC
            // mappedItem[f.propName] = _parseDatetimeUTC(item[prop])
            mappedItem[f.propName] = parse(item[prop])
            break
          case 'lookup':
            mappedItem[f.propName] = _parseLookup(item[prop], { includeLookupValue })
            break
          case 'lookupmulti':
            mappedItem[f.propName] = _parseMultiLookup(item[prop], { includeLookupValue })
            break
          case 'multichoice':
            mappedItem[f.propName] = _parseMultiChoice(item[prop])
            break
          case 'user':
            mappedItem[f.propName] = _parseUser(item[prop])
            break
          case 'usermulti':
            mappedItem[f.propName] = _parseMultiUser(item[prop])
            break
          case 'url':
            mappedItem[f.propName] = _parseUrl(item[prop])
            break
          default:
            mappedItem[f.propName] = '' + item[prop]
        }
      }
    })
    return mappedItem
  })

  return castedItems
}
