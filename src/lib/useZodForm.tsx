import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { generateSchema } from "@anatine/zod-openapi";
import { SchemaObject } from "openapi3-ts";
import { match } from "ts-pattern";
import { Meta } from "../App";
import { BooleanInput } from "../components/BooleanInput";
import { NumberInput } from "../components/NumberInput";
import { TextInput } from "../components/TextInput";
import { SingleProperty } from "../types";

const buildComponent = (field: Meta) => {
  const key = field[0];
  const options = field[1];

  const { placeholder, autocomplete, label, required } = options;

  return (
    match([options.type])
      .with(["boolean"], () => (
        <BooleanInput key={key} name={key} label={label} required={required} />
      ))
      .with(["integer"], () => (
        <NumberInput
          key={key}
          name={key}
          label={label}
          required={required}
          autocomplete={autocomplete}
          placeholder={placeholder}
        />
      ))
      // .with(["string"], () => (
      //   <SelectInput
      //     key={key}
      //     name={key}
      //     label={label}
      //     required={required}
      //     options={options!}
      //   />
      // ))
      .otherwise(() => (
        <TextInput
          key={key}
          name={key}
          label={label}
          required={required}
          autocomplete={autocomplete}
          placeholder={placeholder}
        />
      ))
  );
};

export function useZodForm<T extends z.AnyZodObject>(
  schema: T,
  ui: (
    | [SingleProperty<T>]
    | [SingleProperty<T>, { placeholder?: string; autocomplete?: string }]
  )[]
) {
  // zod-openapi is able to infer type and format (like string and format email).
  const { properties, required } = generateSchema(schema);

  const config = {
    schema,
    meta: ui.map((field) => {
      const key = field[0] as string;
      const options = field[1];

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
          required: required ? required.includes(key as string) : false,
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
    ...helpersHookForm,
  };
}
