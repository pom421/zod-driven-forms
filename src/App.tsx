import type { SingleProperty } from "./types";

import "./styles.css";

import React from "react";
import * as z from "zod";
import { formatISO, isAfter } from "date-fns";
import { FormProvider } from "react-hook-form";

import { formatZodErrors } from "./utils/debug";
import { useZodForm } from "./lib/useZodForm";
import { generateSchema } from "@anatine/zod-openapi";
import { SchemaObject } from "openapi3-ts";

const petPersons = ["cat", "dog", "bird", "none"] as const;

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
  }
];

export type ConfigZDF = {
  schema: z.AnyZodObject;
  meta: Meta[];
};

export const initZDF = <T extends z.AnyZodObject>(
  schema: T,
  ui: (
    | [SingleProperty<T>]
    | [SingleProperty<T>, { placeholder?: string; autocomplete?: string }]
  )[]
) => {
  // zod-openapi is able to infer type and format (like string and format email).
  const { properties, required } = generateSchema(schema);

  const res = {
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

  return res;
};

const configZodForm: ConfigZDF = initZDF(
  z.object({
    nom: z
      .string()
      .min(4, { message: "4 caractères minimum pour le nom" })
      .default("John")
      .describe("Votre nom"),
    age: z
      .number({ invalid_type_error: "Un nombre est attendu" })
      .int({ message: "Un nombre entier est attendu" })
      .refine((val) => val >= 18, { message: "Vous devez être majeur" })
      .default(18)
      .describe("Votre âge"),
    date: z
      .string()
      .min(1, { message: "La date est requise" })
      .transform((val) => new Date(val))
      .refine((val) => val.toString() !== "Invalid Date", {
        message: "Le format de date est incorrect",
      })
      .refine((val) => isAfter(val, new Date("2022-01-01")), {
        message: "La date doit être postérieure au 1er janvier 2022",
      })
      .default(formatISO(new Date(), { representation: "date" }))
      .describe("Date de fin"),
    admin: z.boolean().describe("Est-il admin ?"),
    petPerson: z
      .enum(petPersons)
      .optional()
      .default("cat")
      .describe("Votre animal de compagnie préféré"),
    commentaire: z
      .string()
      .max(256, { message: "Votre message est trop long" })
      .optional()
      .default("")
      .describe("Votre commentaire"),
  }),
  [
    [
      "nom",
      {
        placeholder: "ex: martin",
        autocomplete: "name",
      },
    ],
    [
      "age",
      {
        placeholder: "ex: 18",
      },
    ],
    [
      "date",
      {
        placeholder: "ex: 2021-01-01",
      },
    ],
    ["admin"],
    [
      "petPerson",
      {
        placeholder: "ex: cat",
      },
    ],
    [
      "commentaire",
      {
        placeholder: "ex: J'aime les chats",
      },
    ],
  ]
);

let renderCount = 0;

console.log("configZodForm", configZodForm);

export default function App() {
  renderCount++;

  console.debug("nb renders", renderCount);

  // const methods = useZodForm(config);
  const methods = useZodForm(configZodForm);

  const {
    handleSubmit,
    watch,
    formState: { errors },
    components,
  } = methods;

  console.debug("components", components);

  const onSubmit = (data: unknown) => console.debug(data);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {components}
        </div>

        <input type="submit" />

        <pre>
          {JSON.stringify(
            {
              errors: formatZodErrors(errors),
            },
            null,
            2
          )}
        </pre>
        <pre>{JSON.stringify(watch(), null, 2)}</pre>
      </form>
    </FormProvider>
  );
}
