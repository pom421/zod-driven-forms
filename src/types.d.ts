import * as z from "zod";

export type UISchema<T extends z.ZodType<any, any, any>> = {
  [key in keyof z.input<T>]?: {
    uiComponent?: string | undefined;
    label?: string | undefined;
    placeholder?: string | undefined;
  };
};

export type NormalizedUIElement<T extends z.ZodType<any, any, any>> = {
  id: keyof z.input<T>;
  uiComponent?: string | undefined;
  label?: string | undefined;
  placeholder?: string | undefined;
};

export type UIElement<T extends z.ZodType<any, any, any>> =
  | keyof z.input<T>
  | NormalizedUIElement<T>;

type Property<T extends z.ZodType<any, any, any>> = keyof z.input<T>;

export type Config<T extends z.ZodType<any, any, any>> = {
  schema: T;
  defaultValues: z.input<T>;
  //ui: UISchema<T>;
  ui2: Array<UIElement<T>>;
  //orderComponents: Property<T>[];
};

export type JsonElement = {
  type?: string;
  format?: string;
  enum?: string;
};
