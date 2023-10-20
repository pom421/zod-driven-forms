import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { match } from "ts-pattern";
import { generateSchema } from "@anatine/zod-openapi";
import { ConfigZDF, Meta, initZDF } from "../App";
import { BooleanInput } from "../components/BooleanInput";
import { NumberInput } from "../components/NumberInput";
import { SelectInput } from "../components/SelectInput";
import { TextInput } from "../components/TextInput";

type ExtractFromArray<T extends any[]> = T extends (infer U)[] ? U : never;

type OpenApiMeta = {
  type: string;
};

const buildComponent = (field: Meta) => {
  const key = field[0];
  const options = field[1];

  const {
    placeholder,
    autocomplete,
    label,
    format,
    type,
    defaultValue,
    required,
  } = options;

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

export function useZodForm<T extends z.ZodType<any, any, any>>(
  config: ConfigZDF
) {
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
