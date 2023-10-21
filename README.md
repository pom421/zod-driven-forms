# Objectif

L'idée est de créer une lib, qui a besoin d'un object config,
qui contient un schéma zod et d'éventuelles modification pour l'UI.

La lib, juste en lisant les informations de type de Zod et les infos supplémentaires,
pourraient créer automatiquement les inputs des forms pour avoir instantanément un
formulaire utilisable avec de la validation.

Le schéma zod pourrait être exporté pour être utilisé dans l'app (en particulier aussi dans l'API).

Le schéma zod pourrait aussi servir de validation côté API et éviter de se répéter.

Côté front, les inputs créés automatiquement seront envoyés dans la console JS. Comme ça, on pourra aussi s'en servir comme d'un scaffold et tout customiser si besoin.

Les inputs suivants sont pris en charge :

- number avec composant UI flèche pour incrémenter ou décrémenter
- booléen
- date comme un string formaté ISO avec composant UI datepicker
- texte avec text et textArea
- select avec liste de choix fermée

À venir :

- boutons groupe pour liste de choix fermée (ce widget et le précédent pourront tous les 2 choisir dans un zod enum, donc 2 façons de rentrer les mêmes données)
- messages d'erreur
- select autocomplete asynchrone ?

# Installation

```
yarn install
yarn start
```

## Exemple

See in App.tsx.

```jsx
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
      },
    ],
  ]
);
```

### TODO

- ajouter des customComponent dans la config, pour pouvoir afficher un textarea, un datepicker et un select
- typer correctement le retour de init, afin de récupérer le nom des champs dans onSubmit
