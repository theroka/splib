import { Endpoints } from "./types"

export const ENDPOINTS: Endpoints = {
  GetList: "Lists",
  GetListItems: "Lists",
  UpdateListItems: "Lists",
  GetAttachmentCollection: "Lists",
  AddAttachment: "Lists",
  DeleteAttachment: "Lists",
  GetPermissionCollection: "Permissions",
  GetRoleCollectionFromUser: "UserGroup",
  GetGroupCollectionFromUser: "UserGroup",
  GetRolesAndPermissionsForCurrentUser: "UserGroup",
  GetUserLoginFromEmail: "UserGroup",
  GetUserProfileByName: "UserProfileService",
  GetUserMemberships: "UserProfileService",
  WebUrlFromPageUrl: "Webs"
};

/**
 * Get webservice endpoint for specific Sharepoint webservice action.
 * @param {String} action - Name of webservice action.
 * @param {String} site - URL of (current) Sharepoint site.
 * @return {String}
 */
export function endpointURL(action: string, site: string): string {
  return site + "/_vti_bin/" + ENDPOINTS[action] + ".asmx";
}
