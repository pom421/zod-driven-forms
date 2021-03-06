import { FieldError } from "react-hook-form";
import * as z from "zod";

// Le type de l'objet config, renseigné par l'utilisateur.
export type Config<T extends z.ZodType<any, any, any>> = {
  schema: T;
  defaultValues: z.input<T>;
  ui: Array<SingleProperty<T> | UserUIElement<T>>;
};

// Les informations récupérées de la génération du JSON Schema.
export type JsonElement = {
  type: "string" | "boolean" | "integer";
  format?: string | undefined;
  enum?: string[] | undefined;
};

// L'utilisateur renseigne uniquement un nom de champ.
type SingleProperty<T extends z.ZodType<any, any, any>> = keyof z.input<T>;

export type UIComponent = "datepicker" | "textarea" | undefined;

// L'utilisateur renseigne des éléments supplémentaire pour le champ.
export type UserUIElement<T extends z.ZodType<any, any, any>> = {
  id: SingleProperty<T>;
  uiComponent?: UIComponent;
  label?: string | undefined;
  placeholder?: string | undefined;
  autocomplete?: string | undefined;
};

// Le type final, normalisé, qui servira pour nos traitements.
export type NormalizedUIElement<T extends z.ZodType<any, any, any>> =
  UserUIElement<T> & JsonElement & { required: boolean };

export type JSONSchemaTypes<T extends z.ZodType<any, any, any>> =
  | {
      [key in SingleProperty<T>]: JsonElement;
    };

/** Custom guard to distinguish UserUIElement and string */
export function isUserUIElement<T extends z.ZodType<any, any, any>>(
  element: SingleProperty<T> | UserUIElement<T>
): element is UserUIElement<T> {
  return typeof element?.id === "string" && element.id.length;
}

export type ZodErrors<T extends z.ZodType<any, any, any>> = {
  [key in SingleProperty<T>]: FieldError | undefined;
};
