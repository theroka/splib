export type SiteURL = string | null;

export interface Login {
  DisplayName: string;
  Login: string;
  [key: string]: string;
}

export interface User {
  login?: string;
  email?: string;
  name?: string;
}

export interface StringMap {
  [key: string]: string
}
