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
