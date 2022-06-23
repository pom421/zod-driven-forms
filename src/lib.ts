import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Config, JsonElement, NormalizedUIElement } from "./types";
import { z } from "zod";
import { generateSchema } from "@anatine/zod-openapi";
import { addReactComponents } from "./lib-add";

// Créer tous les éléments et leur donner la même forme.
function normalizeUIElements<T extends z.ZodType<any, any, any>>(
  config: Config<T>,
  properties: {
    [propertyName: string]: { type: string };
  }
) {
  // Clone de l'ensemble des champs.
  const propertiesClone = { ...properties };

  // On parcourt les éléments
  const res = config.ui2.map((elt) => {
    if (typeof elt === "string") {
      delete propertiesClone[elt];

      return {
        id: elt,
        label: "",
        type: properties[elt].type,
      };
    } else {
      return {
        ...(elt as NormalizedUIElement<T>),
        type: properties[(elt as NormalizedUIElement<T>).id as string].type,
      };
    }
  });
}

export function useZodForm<T extends z.ZodType<any, any, any>>(
  config: Config<T>
) {
  const helpersHookForm = useForm({
    resolver: zodResolver(config.schema),
    defaultValues: config.defaultValues,
  });

  console.timeEnd("useForm");

  console.time("generateSchema");
  const { properties } = generateSchema(config.schema);

  console.log({ properties });

  console.timeEnd("generateSchema");

  console.time("middle");
  if (!properties) throw new Error("Pas de propriété trouvée dans le schéma");

  const allProperties = Object.keys(properties);

  const citedComponents = config.ui2.map((elt) =>
    typeof elt === "string" ? elt : (elt as NormalizedUIElement<T>).id
  );

  const missingKeys = allProperties.filter(
    (property) => citedComponents.indexOf(property) === -1
  );

  const orderComponents = [...citedComponents, ...missingKeys];

  console.log("orderComponents", orderComponents);

  console.timeEnd("middle");

  // TODO : je cherche à récupérer les infos dans UI s'il y en a.
  // Donc itération sur orderComponents pour récupérer la key.
  // Récupérer dans ui, éventuellement l'élément qui a ce nom. Attention,
  // soit on a un string dans le tableau soit un objet avec un id.
  // récupérer le label si on a l'info.

  console.time("generateUIFields");
  const generatedUIFields = orderComponents.map((key) => {
    const { type, format, enum: myEnum } = properties[key] as JsonElement;
    const eltUI = config.ui2?.[key];

    return addReactComponents({ key, type, label: eltUI?.label });
  });

  console.timeEnd("generateUIFields");

  console.timeEnd("useZodForm");

  return {
    //generatedUIFields,
    ...helpersHookForm,
  };
}
