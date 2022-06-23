import React from "react";
import { BooleanInput } from "./BooleanInput";
import { TextInput } from "./TextInput";

export function addReactComponents({
  key,
  type,
  label,
}: {
  key: string;
  type: string;
  label: string;
}) {
  if (type === "boolean")
    return <BooleanInput key={key} name={key} label={label} />;
  else return <TextInput key={key} name={key} label={label} />;
}
