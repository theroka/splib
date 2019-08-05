"use strict";

import { format } from "date-fns";
import { getType } from "./utils";

/**
 * Parse UTC datetime string into Date object
 * @param {Sring} input
 * @return {Date}
 */
export function parseDatetimeUTC(input: string): Date {
  const y = input.split("T")[0].split("-");
  const t = input
    .split("T")[1]
    .replace("Z", "")
    .split(":");
  let d = new Date();
  d.setUTCFullYear(parseInt(y[0]));
  d.setUTCMonth(parseInt(y[1]) - 1);
  d.setUTCDate(parseInt(y[2]));
  d.setUTCHours(parseInt(t[0]));
  d.setUTCMinutes(parseInt(t[1]));
  d.setUTCSeconds(parseInt(t[2]));
  return d;
}

/**
 * Create UTC datetime string for Sharepoint.
 * @param {Date} date - Date object
 * @param {Boolean} dateOnly=false Set 'true' for set timestamp to 00:00:00
 * @return {String}
 * @example
 * let d = new Date() // e.g. 01.01.1970 13:30
 * let t = castDatetimeUTC(d)
 * console.log(t) // 1970-01-01T13:30:00Z
 */
export function castDatetimeUTC(date: Date, dateOnly = false): string {
  if (["", null, undefined].includes) return "";
  let cast = "";
  const dateFormat = "yyyy-MM-ddTHH:mm:ssZZ";
  switch (getType(date)) {
    case "date":
      cast = format(date, dateFormat)
      // const dy = date.getUTCFullYear();
      // const dm = ("0" + date.getUTCMonth()).slice(-2);
      // const dd = ("0" + date.getUTCDate()).slice(-2);
      // const th = dateOnly ? "00" : ("0" + date.getUTCHours()).slice(-2);
      // const tm = dateOnly ? "00" : ("0" + date.getUTCMinutes()).slice(-2);
      // const ts = dateOnly ? "00" : ("0" + date.getUTCSeconds()).slice(-2);
      // cast = `${dy}-${dm}-${dd}T${th}:${tm}:${ts}Z`;
      break;
  }
  return cast;
}
