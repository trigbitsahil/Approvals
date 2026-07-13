export interface FieldConfig {
  name: string;
  label: string;
  type: "text" | "email" | "textarea";
  required?: boolean;
}

export interface CrudConfig<TCreate, TUpdate, TList> {
  //
  title: string;
  fields: FieldConfig[];
  getList: () => Promise<TList[]>;
  create: (d: TCreate) => Promise<any>;
  update: (d: TUpdate) => Promise<any>;
  delete: (id: string) => Promise<any>;
  idKey?: string | ((item: any) => string);
}
