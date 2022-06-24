import "./styles.css";

import React from "react";
import * as z from "zod";
import { formatISO, isAfter } from "date-fns";
import { Config } from "./types";
import { useZodForm } from "./lib/useZodForm";
import { FormProvider } from "react-hook-form";
import { formatZodErrors } from "./utils/debug";
/**
 * Note :
 * - une value d'un input html est forcément un string, string[], number ou undefined.
 * React.InputHTMLAttributes<HTMLInputElement>.value?: string | number | readonly string[] | undefined
 *
 */

/**
 * L'idée est de créer une lib, qui a besoin d'un object config,
 * qui contient un schéma zod et d'éventuelles modification pour l'UI.
 *
 * La lib, juste en lisant les informations de type de Zod et les infos supplémentaires,
 * pourraient créer automatiquement les inputs des forms pour avoir instantanément un
 * formulaire utilisable avec de la validation.
 *
 * Le schéma zod pourrait être exporté pour être utilisé dans l'app (en particulier aussi dans l'API).
 *
 * Le schéma zod pourrait aussi servir de validation côté API et éviter de se répéter.
 *
 * Côté front, les inputs créés automatiquement seront envoyés dans la console JS. Comme ça, on pourra aussi s'en servir comme d'un scaffold et tout customiser si besoin.
 *
 * Gérer les inputs :
 * - texte
 * - number avec composant UI flêche pour incrémenter ou décrémenter
 * - booléen
 * - date comme un string formaté ISO avec composant UI datepicker
 * - select avec liste de choix fermée (cf. ligne suivante)
 * - boutons groupe pour liste de choix fermée (ce widget et le précédent pourront tous les 2 choisir dans un zod enum, donc 2 façons de rentrer les mêmes données)
 * - select autocomplete asynchrone ?
 */

// const petPersons = ["cat", "dog", "bird", "none"] as const;
const petPersons = ["cat", "dog", "bird", "none"] as const;

const userSchema = z.object({
  nom: z.string().min(4, { message: "4 caractères minimum pour le nom" }),
  age: z
    // 7 - invalid_type_error permet de customiser le message si pas de type nubmer
    .number({ invalid_type_error: "Un nombre est attendu" })
    .int({ message: "Un nombre entier est attendu" })
    // 8 - contrôle métier exemple
    .refine((val) => val > 18, { message: "Vous devez être majeur" }),
  date: z
    .string()
    .min(1, { message: "La date est requise" })
    // 9 - En sortie, ça sera une vraie Date
    .transform((val) => new Date(val))
    // 10 - contrôle pour vérifier que c'est une représentation OK d'une date
    .refine((val) => val.toString() !== "Invalid Date", {
      message: "Le format de date est incorrect",
    })
    // 11 - contrôle métier exemple
    .refine((val) => isAfter(val, new Date("2022-01-01")), {
      message: "La date doit être postérieure au 1er janvier 2022",
    }),
  admin: z.boolean(),
  petPerson: z.enum(petPersons),
});

type UserFormInputSchema = z.input<typeof userSchema>;

const config: Config<typeof userSchema> = {
  schema: userSchema,
  ui: [
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
  ],
  defaultValues: {
    nom: "John",
    age: 15,
    date: formatISO(new Date(), { representation: "date" }),
    admin: true,
    petPerson: "cat",
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
        {/* <label>
          Nom
          <input type="text" placeholder="Nom" {...register("nom")} />
        </label>

        <label>
          Âge
          <input
            type="number"
            placeholder="Age"
            {...register("age", { valueAsNumber: true })}
          />
        </label>

        <label>
          Date début contrat
          <input type="date" placeholder="Date" {...register("date")} />
        </label>

        <p>
          <label>
            Est admin?&nbsp;
            <BooleanInput name="admin" />
          </label>
        </p> */}

        {/* <p>
          <label>
            Pet preference
            <select {...register("petPerson")}>
              {petPersons.map((elt) => (
                <option key={elt} value={elt}>
                  {elt}
                </option>
              ))}
            </select>
          </label>
        </p>
 */}
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
