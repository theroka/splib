export type QueryString = string | null;

export interface FieldMap {
  [key: string]: string;
}

export interface FieldDef {
  id: string;
  type: string;
  displayName: string;
  staticName: string;
  name: string;
  mappedName?: string;
  required: boolean;
  hidden: boolean;
  dateOnly: boolean;
}

export type Fields = Array<FieldDef>

export interface List {
  id: string;
  title: string;
  description: string;
  created: Date;
  modified: Date;
  defaultView: string;
  attachments: boolean;
  folders: boolean;
  itemsCount: number;
  fields: Array<FieldDef>;
}

export interface FuncMap {
  [key: string]: any
}

export type DataArray = string[] | number[] | boolean[] | null[];

export interface DataItem {
  [key: string]: string | number | boolean | null | DataItem | DataItem[] | DataArray;
}
