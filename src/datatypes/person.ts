"use strict";

const DEFAULT_SP_DELIMITER = ";#";
const DEFAULT_NAME_DELIMITER = ",#";

interface User {
  id?: number;
  username?: string;
  email?: string;
}

/**
 * Returns Sharepoint type 'person' as string.
 * @param {String} value
 * @return {String}
 */
export function castPerson(value: any) {
  if (value === null) return "";
  const regexID = /^-?[0-9]+;#.*$/g;
  const name = "" + value;
  const prefix = regexID.test(name) ? "" : "-1;#";
  return prefix + name;
}

/**
 * @param {String} input
 * @param {String} [delimiter]
 * @param {String} [nameDelimiter]
 */
export function parsePerson(
  input: string,
  delimiter: string = DEFAULT_SP_DELIMITER,
  nameDelimiter: string = DEFAULT_NAME_DELIMITER
): User | null {
  if (input == "" || input == null) return null;
  const userDomainRegex = /^.*\\.*$/g;
  const emailRegex = /^[a-z0-9_\-\.]*@[a-z0-9_\-\.]*\.[a-z]{2,5}$/g;
  const user = input.split(delimiter);
  const id = parseInt(user[0]);
  const value = user[1].split(nameDelimiter);
  const username = value.find(el => userDomainRegex.test(el));
  const email = value.find(el => emailRegex.test(el));
  return { id, username, email };
}

/**
 * @param {*} input
 * @param {*} delimiter
 * @param {*} nameDelimiter
 */
export function parseMultiPerson(
  input: string,
  delimiter: string = DEFAULT_SP_DELIMITER,
  nameDelimiter: string = DEFAULT_NAME_DELIMITER
): Array<User> | null {
  if (input == "" || input == null) return null;
  const userDomainRegex = /^.*\\.*$/g;
  const emailRegex = /^([a-z0-9_\-.]*)@([a-z0-9_\-.]*)\.([a-z]{2,5})$/g;
  const tokens = input.split(delimiter);
  let users: Array<User> = [];
  tokens.forEach((v, i, c) => {
    if (i % 2 === 0) {
      const id = parseInt(v);
      const value = c[i + 1].split(nameDelimiter);
      const username = value.find(el => userDomainRegex.test(el));
      const email = value.find(el => emailRegex.test(el));
      users.push({ id, username, email });
    }
  });
  return users;
}
