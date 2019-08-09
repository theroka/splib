"use strict";

import { createLog } from "../utils/log";
import { parse } from "date-fns";
import { getOptions, endpointURL, createSoapBody, parser } from "./../caml";
import { getCurrentSite } from "./../site";
import { SiteURL } from "../user/types";
import { List } from "./types";

const log = createLog("getList")
const ACTION = "GetList";

/**
 * Get all field definitions of a Sharepoint list
 * @param {String} listname Name of Sharepoint list
 * @param {Object} [options]
 * @param {String} [options.site] URL to Sharepoint list
 * @return {Promise<Object>}
 */
export async function getList(listname: string, site: SiteURL = null): Promise<List> {
  log.group();
  const siteUrl = site || (await getCurrentSite());
  log.debug("get list", listname, "from", siteUrl);
  const caml = `<listName>${listname}</listName>`;
  const body = createSoapBody(ACTION, caml);
  const url = endpointURL(ACTION, siteUrl);
  const options = getOptions(ACTION);

  let response = await fetch(url, { ...options, body });
  let xml = await response.text();

  log.debug("parser path", "List")

  let data: any = parser(xml, ACTION, "List")[0];

  log.debug("data", data);

  let fields = data.Fields.Field.slice().map((field: any) => ({
    id: field.ID,
    type: field.Type.toLowerCase(),
    displayName: field.DisplayName,
    staticName: field.StaticName,
    name: field.Name,
    required: field.Required === "TRUE" || false,
    hidden: field.Format === "DateOnly" || false,
    dateOnly: field.Hidden === "TRUE" || false
  }));

  log.debug("fields", fields)

  let list = {
    id: data.ID,
    title: data.Title.trim() || "",
    description: data.Description.trim() || "",
    created: parse(data.Created) || null,
    modified: parse(data.Modified) || null,
    defaultView: data.DefaultViewUrl || "",
    attachments: data.EnableAttachments === "True" ? true : false,
    folders: data.EnableFolderCreation === "True" ? true : false,
    itemsCount: parseInt(data.ItemCount),
    fields
  };

  log.debug("list", list);
  log.group();

  return list;
}
