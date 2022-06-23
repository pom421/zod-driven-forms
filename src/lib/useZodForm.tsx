import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Config,
  isUserUIElement,
  JSONSchemaTypes,
  UserUIElement,
} from "../types";
import { z } from "zod";
import { generateSchema } from "@anatine/zod-openapi";
import { buildComponent } from "../component-builder";

// Créer tous les éléments et leur donner la même forme.
function buildNormalizedUIElements<T extends z.ZodType<any, any, any>>(
  config: Config<T>
) {
  const { properties } = generateSchema(config.schema);

  if (!properties) throw new Error("Pas de propriété trouvée dans le schéma");

  // Clone de l'ensemble des champs.
  const propertiesClone = { ...properties } as JSONSchemaTypes<T>;

  // On parcourt les éléments
  let res = config.ui.map((elt) => {
    // Cas string.
    if (!isUserUIElement<T>(elt)) {
      delete propertiesClone[elt];

      return {
        id: elt,
        label: "",
        type: propertiesClone[elt].type,
      };
    } else {
      // Cas élément UIElement.
      delete propertiesClone[elt.id];
      return {
        ...(elt as UserUIElement<T>),
        type: propertiesClone[(elt as UserUIElement<T>).id].type,
      };
    }
  });

  // On ajoute les champs qui n'ont pas été renseignés explicitement dans config.ui.
  res.concat(
    Object.entries(propertiesClone).map((elt) => {
      return {
        id: elt[0],
        label: "",
        type: elt[1].type,
      };
    })
  );

  return res;
}

export function useZodForm<T extends z.ZodType<any, any, any>>(
  config: Config<T>
) {
  const helpersHookForm = useForm({
    resolver: zodResolver(config.schema),
    defaultValues: config.defaultValues,
  });

  const normalizedElements = buildNormalizedUIElements(config);

  const generatedUIFields = normalizedElements.map(({ id, type, label }) => {
    return buildComponent({
      key: id as string,
      type,
      label,
    });
  });

  return {
    generatedUIFields,
    ...helpersHookForm,
  };
}
