import "./styles.css";

import { formatISO, isAfter } from "date-fns";
import { FormProvider } from "react-hook-form";
import * as z from "zod";

import { useZodForm } from "./lib/useZodForm";
import { formatZodErrors } from "./utils/debug";

const petPersons = ["cat", "dog", "bird"] as const;

const schema = z.object({
  nom: z
    .string()
    .min(4, { message: "4 caractères minimum pour le nom" })
    .default("John")
    // describe will be used to generate the label.
    .describe("Votre nom"),
  // Type number will be displayed with a number input.
  age: z
    .number({ invalid_type_error: "Un nombre est attendu" })
    .int({ message: "Un nombre entier est attendu" })
    .refine((val) => val >= 18, { message: "Vous devez être majeur" })
    .default(18)
    .describe("Votre âge (input type number ✨✨)"),
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
    .describe(
      "Date de fin (input type date avec un datepicker (cf. champ ui) ✨✨)"
    ),
  admin: z.boolean().describe("Est-ce un admin ? (input type checkbox ✨✨)"),
  petPerson: z
    // enum will be displayed as a select.
    .enum(petPersons)
    .optional()
    .default("cat")
    .describe("Votre animal de compagnie préféré (select ✨✨)"),
  commentaire: z
    .string()
    .max(256, { message: "Votre message est trop long" })
    .optional()
    .default("")
    .describe("Votre commentaire (textarea ✨✨)"),
});

let renderCount = 0;

// console.log("configZodForm", configZodForm);

export default function App() {
  renderCount++;

  console.debug("nb renders", renderCount);

  const methods = useZodForm(schema, [
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
        customComponent: "datepicker",
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
        customComponent: "textarea",
      },
    ],
  ]);

  const {
    handleSubmit,
    watch,
    formState: { errors },
    components,
    openapi,
  } = methods;

  console.debug("components", components);

  const onSubmit = (data: unknown) => console.debug(data);

  return (
    <div style={{ margin: 20 }}>
      <h1>Zod driven form</h1>
      <p>Ce formulaire est généré dynamiquement, à partir d'un schéma zod.</p>
      {/* TODO: trouver moyen d'afficher le schéma utilisé... */}
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 5,
            }}
          >
            {components}
          </div>

          <input type="submit" />

          <br />
          <details>
            <summary>Debug RHF</summary>
            <fieldset>
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
            </fieldset>
          </details>
          <details>
            <summary>Debug openapi</summary>
            <fieldset>
              <pre>{JSON.stringify(openapi, null, 2)}</pre>
            </fieldset>
          </details>
        </form>
      </FormProvider>
    </div>
  );
}
