"use strict";

import { parse } from "date-fns";
import { getOptions, endpointURL, createSoapBody, parser } from "./../caml";
import { getCurrentSite } from "./../site";
import { SiteURL } from "../user/types";
import { List } from "./types";

const ACTION = "GetList";

/**
 * Get all field definitions of a Sharepoint list
 * @param {String} listname Name of Sharepoint list
 * @param {Object} [options]
 * @param {String} [options.site] URL to Sharepoint list
 * @return {Promise<Object>}
 */
export async function getList(listname: string, site: SiteURL = null): Promise<List> {
  const siteUrl = site || (await getCurrentSite());
  const caml = `<listName>${listname}</listName>`;
  const body = createSoapBody(ACTION, caml);
  const url = endpointURL(ACTION, siteUrl);
  const options = getOptions(ACTION);

  let response = await fetch(url, { ...options, body });
  let xml = await response.text();

  let data: any = parser(xml, ACTION, "List");

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

  return {
    id: data.ID,
    title: data.Title.trim(),
    description: data.Description.trim(),
    created: parse(data.Created),
    modified: parse(data.Modified),
    defaultView: data.DefaultViewUrl,
    attachments: data.EnableAttachments === "True" ? true : false,
    folders: data.EnableFolderCreation === "True" ? true : false,
    itemsCount: parseInt(data.ItemCount),
    fields
  };
}
