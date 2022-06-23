import * as z from "zod";

// TODO : à supprimer ?
export type UISchema<T extends z.ZodType<any, any, any>> = {
  [key in SingleProperty<T>]?: {
    uiComponent?: string | undefined;
    label?: string | undefined;
    placeholder?: string | undefined;
  };
};

// Le type de l'objet config, renseigné par l'utilisateur.
export type Config<T extends z.ZodType<any, any, any>> = {
  schema: T;
  defaultValues: z.input<T>;
  ui: Array<SingleProperty<T> | UserUIElement<T>>;
};

// Les informations récupérées de la génération du JSON Schema.
// TODO: à compléter en fonction des besoins.
export type JsonElement = {
  type: string;
  format?: string | undefined;
  enum?: string | undefined;
};

// L'utilisateur renseigne uniquement un nom de champ.
type SingleProperty<T extends z.ZodType<any, any, any>> = keyof z.input<T>;

// L'utilisateur renseigne des éléments supplémentaire pour le champ.
export type UserUIElement<T extends z.ZodType<any, any, any>> = {
  id: SingleProperty<T>;
  uiComponent?: string | undefined;
  label?: string | undefined;
  placeholder?: string | undefined;
};

// Le type final, normalisé, qui servira pour nos traitements.
export type NormalizedUIElement<T extends z.ZodType<any, any, any>> =
  UserUIElement<T> & JsonElement;

export type JSONSchemaTypes<T extends z.ZodType<any, any, any>> =
  | {
      [key in SingleProperty<T>]: JsonElement;
    };

export function isUserUIElement<T extends z.ZodType<any, any, any>>(
  element: any
): element is UserUIElement<T> {
  return typeof element?.id === "string" && element.id.lengh;
}
