'use strict'

/**
 * @memberof module:Types
 * @alias module:Types._parseUser
 * @private
 *
 * @param {*} str
 * @param {*} delimiter
 * @param {*} nameDelimiter
 */
export function _parseUser (str, delimiter = ';#', nameDelimiter = ',#') {
  if (str == '' || str == null || str == undefined) return null
  const userDomainRegex = /^.*\\.*$/g
  const emailRegex = /^[a-z0-9_\-\.]*@[a-z0-9_\-\.]*\.[a-z]{2,5}$/g
  const user = str.split(delimiter)
  const id = parseInt(user[0])
  const value = user[1].split(nameDelimiter)
  const username = value.find(el => userDomainRegex.test(el))
  const email = value.find(el => emailRegex.test(el))
  return { id, value, username, email }
}


/**
 * @memberof module:Types
 * @alias module:Types._parseMultiUser
 * @private
 *
 * @param {*} str
 * @param {*} delimiter
 * @param {*} nameDelimiter
 */
export function _parseMultiUser (str, delimiter = ';#', nameDelimiter = ',#') {
  if (str == '' || str == null || str == undefined) return null
  const userDomainRegex = /^.*\\.*$/g
  const emailRegex = /^[a-z0-9_\-\.]*@[a-z0-9_\-\.]*\.[a-z]{2,5}$/g
  const tokens = str.split(delimiter)
  let users = []
  tokens.forEach((v, i, c) => {
    if (i % 2 === 0) {
      const id = parseInt(v)
      const value = c[i + 1].split(nameDelimiter)
      const username = value.find(el => userDomainRegex.test(el))
      const email = value.find(el => emailRegex.test(el))
      users.push({ id, value, username, email })
    }
  })
  return users
}


/**
 * Returns Sharepoint type 'person' as string.
 * @memberof module:Types
 * @alias module:Types._createPerson
 * @private
 *
 * @param {String} value
 * @return {String}
 *
 * @TODO: Add example and return value descr to doc comments
 */
export function _createPerson (value) {
  if (value === null) return ''
  const regexID = /^\-?[0-9]+;#.*$/g
  const name = '' + value
  const prefix = regexID.test(name) ? '' : '-1;#'
  return prefix + name
}
