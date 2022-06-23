import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Config, isUserUIElement, JSONSchemaTypes } from "../types.d";
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

  console.log("propertiesClone", JSON.stringify(propertiesClone, null, 2));

  // On parcourt les éléments
  let res = config.ui.map((elt) => {
    // Cas string.
    if (!isUserUIElement<T>(elt)) {
      delete propertiesClone[elt];

      console.log(" propertiesClone[elt].type", propertiesClone[elt].type);

      return {
        id: elt,
        label: "",
        type: propertiesClone[elt].type,
      };
    } else {
      // Cas élément UIElement.
      delete propertiesClone[elt.id];

      console.log(
        " propertiesClone[elt.id].type",
        propertiesClone[elt.id].type
      );
      return {
        ...elt,
        type: propertiesClone[elt.id].type,
      };
    }
  });

  // On ajoute les champs qui n'ont pas été renseignés explicitement dans config.ui.
  res.concat(
    Object.entries(propertiesClone).map((elt) => {
      console.log("elt[1].type", elt[1].type);
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
