import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { generateSchema } from "@anatine/zod-openapi";
import { SchemaObject } from "openapi3-ts";
import { P, match } from "ts-pattern";
import { BooleanInput } from "../components/BooleanInput";
import { DateInput } from "../components/DateInput";
import { NumberInput } from "../components/NumberInput";
import { SelectInput } from "../components/SelectInput";
import { TextAreaInput } from "../components/TextAreaInput";
import { TextInput } from "../components/TextInput";
import { SingleProperty } from "../types";

export type Meta = [
  string,
  {
    defaultValue: unknown;
    required: boolean;
    // Récupération du type et format depuis le zod-openapi.
    type: SchemaObject["type"];
    format: SchemaObject["format"];
    placeholder: string;
    label: string;
    autocomplete: string;
    customComponent?: string;
    values?: string[];
  }
];

export type ConfigZDF = {
  schema: z.AnyZodObject;
  meta: Meta[];
};

const buildComponent = (field: Meta) => {
  const key = field[0];
  const options = field[1];

  const {
    placeholder,
    autocomplete,
    label,
    required,
    customComponent,
    values,
  } = options;

  return match([options.type, customComponent])
    .with(["boolean", P._], () => (
      <BooleanInput key={key} name={key} label={label} required={required} />
    ))
    .with(["integer", P._], () => (
      <NumberInput
        key={key}
        name={key}
        label={label}
        required={required}
        autocomplete={autocomplete}
        placeholder={placeholder}
      />
    ))
    .with(["string", "datepicker"], () => (
      <DateInput key={key} name={key} label={label} required={required} />
    ))
    .with(["string", "textarea"], () => (
      <TextAreaInput key={key} name={key} label={label} required={required} />
    ))
    .with(["string", "select"], () => (
      <SelectInput
        key={key}
        name={key}
        label={label}
        required={required}
        options={values!}
      />
    ))
    .otherwise(() => (
      <TextInput
        key={key}
        name={key}
        label={label}
        required={required}
        autocomplete={autocomplete}
        placeholder={placeholder}
      />
    ));
};

type ConfigOptions = {
  placeholder?: string;
  autocomplete?: string;
  customComponent?: "datepicker" | "textarea";
};

/**
 * Wrapper around React Hook Form and builder of components based on zod schema.
 *
 * @param schema The zod schema
 * @param ui Optional UI configuration. The order of the fields in the array will be the order of the fields in the form.
 * @returns Array of React components
 */
export function useZodForm<T extends z.AnyZodObject>(
  schema: T,
  ui: (SingleProperty<T> | [SingleProperty<T>, ConfigOptions])[]
) {
  // zod-openapi is able to infer type and format (like string and format email).
  const { properties, required } = generateSchema(schema);

  const config = {
    schema,
    meta: ui.map((field) => {
      const key =
        typeof field === "string"
          ? field
          : (field as [string, ConfigOptions])[0];
      const options =
        typeof field === "string"
          ? null
          : (field as [string, ConfigOptions])[1];
      const values = (properties?.[key] as SchemaObject)?.enum;

      return [
        key,
        {
          type: (properties?.[key] as SchemaObject)?.type,
          format: (properties?.[key] as SchemaObject)?.format,
          // User needs to provide a default value for each field.
          defaultValue: schema.shape[key].default,
          label: schema.shape[key].description ?? "",
          placeholder: options?.placeholder ?? "",
          autocomplete: options?.autocomplete ?? "off",
          customComponent:
            values && values.length > 0 ? "select" : options?.customComponent,
          required: required ? required.includes(key as string) : false,
          values: (properties?.[key] as SchemaObject)?.enum,
        },
      ] as Meta; // TODO: fix this type.
    }),
  };

  // Should be OK if all subschemas implements a .default() method.
  const defaultValues = config.schema.safeParse({});

  const helpersHookForm = useForm({
    resolver: zodResolver(config.schema),
    defaultValues: defaultValues.success ? defaultValues.data : {},
  });

  const components = [];

  for (const field of config.meta) {
    components.push(buildComponent(field));
  }

  return {
    components,
    // Return all properties from React Hook Form.
    ...helpersHookForm,
    openapi: {
      properties,
      required,
    },
  };
}
