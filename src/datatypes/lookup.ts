"use strict";

// module imports
import { LookupData } from "./types";

// constants
const DEFAULT_SP_DELIMITER = ";#";

/**
 * Parse and split lookup value into ID and value.
 * @param {String} input
 * @param {String} delimiter
 * @return {Object}
 */
export function parseLookup(
  input: string,
  delimiter: string = DEFAULT_SP_DELIMITER
): LookupData {
  const kv = input.split(delimiter);
  const id = parseInt(kv[0]);
  const value = kv[1];
  return { id, value };
  // @TODO: Parse value string into JS type.
}

/**
 * Parse and split multi-lookup into array.
 * @param {String} input
 * @param {String} [delimiter] Default: ";#"
 * @return {LookupData[]} Array of lookup items with ID and value.
 */
export function parseMultiLookup(
  input: string,
  delimiter: string = DEFAULT_SP_DELIMITER
): LookupData[] {
  const arr = input.split(delimiter);
  let values: Array<LookupData> = [];
  arr.map((elem, index, collection) => {
    if (index % 2 === 0) {
      const id = parseInt(elem);
      const value = collection[index + 1];
      values.push({ id, value });
    }
  });
  return values.length != 0 ? values : [];
}

/**
 * Cast string or number into Sharepoint type 'lookup'
 * @param {String} value
 * @param {Number} [id=null]
 * @param {String} [delimiter=';#'] Overwrite default Sharepoint delimiter
 * @return {String}
 */
export function castLookup(
  value: string,
  id: number | null = null,
  delimiter = DEFAULT_SP_DELIMITER
): string {
  if (value === null) return "";
  return `${id ? id : "-1"}${delimiter}${value}`;
}

/**
 * Create SP string to CRUD multilookup value.
 * Passed value has to be an array.
 * Array items can be string, array or object.
 * Pass item collection as [{ id, value }, { id, value }, ...]
 * Pass array collection as [[ id, value ], [ id, value ], ... ]
 * @param {Object[]|Array[]} values
 * @param {String} delimiter
 * @return {String}
 */
export function castMultiLookup(
  values: Array<any>,
  delimiter: string = DEFAULT_SP_DELIMITER
): string {
  if (values === null) return "";
  let lookups: Array<string> = [];

  values.forEach((item: any) => {
    if (item instanceof Array && item.length <= 2) {
      lookups.push(castLookup(item[0], item[1], delimiter));
    }

    if (typeof item === "object" && !(item instanceof Array)) {
      let { id, value } = item;
      let lookup = castLookup(value, id, delimiter);
      if (lookup != "") lookups.push(lookup);
    }
  });

  return lookups.join(delimiter);
}
