export type Namespace = string | null;
export type Path = string | null;
export type Action = "" | string;

export interface Endpoints {
  [key: string]: string
}

export const CAML_NAMESPACE = "http://schemas.microsoft.com/sharepoint/soap/";
