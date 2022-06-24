import type { Config } from "./types";

import "./styles.css";

import React from "react";
import * as z from "zod";
import { formatISO, isAfter } from "date-fns";
import { FormProvider } from "react-hook-form";

import { useZodForm } from "./lib/useZodForm";
import { formatZodErrors } from "./utils/debug";

// Exemple avec le schéma zod suivant :

const petPersons = ["cat", "dog", "bird", "none"] as const;

const userSchema = z.object({
  nom: z.string().min(4, { message: "4 caractères minimum pour le nom" }),
  age: z
    .number({ invalid_type_error: "Un nombre est attendu" })
    .int({ message: "Un nombre entier est attendu" })
    .refine((val) => val > 18, { message: "Vous devez être majeur" }),
  date: z
    .string()
    .min(1, { message: "La date est requise" })
    .transform((val) => new Date(val))
    .refine((val) => val.toString() !== "Invalid Date", {
      message: "Le format de date est incorrect",
    })
    .refine((val) => isAfter(val, new Date("2022-01-01")), {
      message: "La date doit être postérieure au 1er janvier 2022",
    }),
  admin: z.boolean(),
  petPerson: z.enum(petPersons),
  commentaire: z
    .string()
    .min(10, { message: "Votre message est trop petit" })
    .max(256, { message: "Votre message est trop long" }),
});

type UserFormInputSchema = z.input<typeof userSchema>;

const config: Config<typeof userSchema> = {
  schema: userSchema,
  ui: [
    { id: "nom", label: "Votre nom", placeholder: "ex: martin" },
    { id: "age", label: "Votre âge" },
    {
      id: "date",
      label: "Date de fin",
      uiComponent: "datepicker",
    },
    {
      id: "admin",
      label: "Est-il admin ?",
    },
    { id: "petPerson", label: "Votre animal de compagnie préféré" },
    { id: "commentaire", label: "Votre commentaire", uiComponent: "textarea" },
  ],
  defaultValues: {
    nom: "John",
    age: 15,
    date: formatISO(new Date(), { representation: "date" }),
    admin: true,
    petPerson: "cat",
    commentaire: "",
  },
};

let renderCount = 0;

export default function App() {
  renderCount++;

  console.debug("nb renders", renderCount);

  const methods = useZodForm(config);

  const {
    handleSubmit,
    watch,
    formState: { errors },
    generatedUIFields,
  } = methods;

  console.debug("generatedUIFields", generatedUIFields);

  const onSubmit = (data: UserFormInputSchema) => console.debug(data);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {generatedUIFields}
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
