import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Config,
  isUserUIElement,
  JSONSchemaTypes,
  NormalizedUIElement,
} from "../types.d";
import { z } from "zod";
import { generateSchema } from "@anatine/zod-openapi";
import { buildComponent } from "../component-builder";

// Créer tous les éléments et leur donner la même forme.
function buildNormalizedUIElements<T extends z.ZodType<any, any, any>>(
  config: Config<T>
): Array<NormalizedUIElement<T>> {
  const { properties } = generateSchema(config.schema);

  if (!properties) throw new Error("Pas de propriété trouvée dans le schéma");

  // Clone de l'ensemble des champs.
  const propertiesClone = { ...properties } as JSONSchemaTypes<T>;

  // On parcourt les éléments
  let customisedElements = config.ui.map((elt) => {
    // Cas string.
    if (!isUserUIElement<T>(elt)) {
      const element = {
        id: elt,
        type: propertiesClone[elt].type,
      };
      delete propertiesClone[elt];
      return element;
    } else {
      // Cas élément UIElement.
      const element = {
        ...elt,
        type: propertiesClone[elt.id].type,
      };

      delete propertiesClone[elt.id];

      return element;
    }
  });

  // On ajoute les champs qui n'ont pas été renseignés explicitement dans config.ui.
  return [
    ...customisedElements,
    ...Object.entries(propertiesClone).map((elt) => {
      return {
        id: elt[0],
        label: "",
        type: elt[1].type,
      };
    }),
  ];
}

export function useZodForm<T extends z.ZodType<any, any, any>>(
  config: Config<T>
) {
  const helpersHookForm = useForm({
    resolver: zodResolver(config.schema),
    defaultValues: config.defaultValues,
  });

  const normalizedElements = buildNormalizedUIElements(config);

  console.debug(
    "normalizedElements",
    JSON.stringify(normalizedElements, null, 2)
  );

  const generatedUIFields = normalizedElements.map(({ id, ...rest }) => {
    return buildComponent({
      key: id as string,
      ...rest,
    });
  });

  return {
    generatedUIFields,
    ...helpersHookForm,
  };
}
