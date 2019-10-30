"use strict";

import { FieldDef } from "./types"
import { toXLString } from "./XSL";
import { Fields } from "../list/types";

/**
 * Get default field map. Used to map fields to item props automatically, if you
 * do not passed field names you want to fetch from a Sharepoint list.
 * @param {Object} list - List object
 */
export function getDefaultFields(list: any) {
  const unselect = [
    "FolderChildCount",
    "ItemChildCount",
    "Attachments",
    "_UIVersionString"
  ];
  const visibleFields = list.filter((f: FieldDef) => {
    return (!f.hidden && !(["computed", "lookup", "lookupmulti"].includes(f.type)) && !unselect.includes(f.name));
  });
  const fields: any = {};
  visibleFields.forEach((f: FieldDef) => {
    const n = f.name.replace("ows_", "");
    fields[f.name] = n.toLowerCase();
  });
  return fields;
}

/**
 * Get ID of field by name in Sharepoint list
 * Checks against static names, names and display names of fields.
 * @param {Fields} fields - Fields collection
 * @param {String} fieldName - Name of field to get ID of
 * @TODO: Add switch cases using XSL field names.
 */
export function getFieldID(fields: Fields, fieldName = "") {
  const dn = new Map();
  const sn = new Map();
  const nm = new Map();
  const field = fieldName.toLowerCase().trim();
  const xslField = toXLString(field);

  fields.forEach(f => {
    // @NOTE: Added this filter to prevent set "Title" by DisplayName,
    // since multiple (computed) fields have the same display name.
    dn.set(f.displayName.toLowerCase(), f.id);
    sn.set(f.staticName.toLowerCase(), f.id);
    nm.set(f.name.toLowerCase(), f.id);
  });

  let id = null;

  switch (true) {
    case sn.has(xslField):
    case sn.has(field):
      id = sn.get(field);
      break;
    case nm.has(xslField):
    case nm.has(field):
      id = nm.get(field);
      break;
    case dn.has(field):
      id = dn.get(field);
      break;
  }

  return id;
}
