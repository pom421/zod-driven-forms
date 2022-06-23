import React from "react";
import { BooleanInput } from "./components/BooleanInput";
import { TextInput } from "./components/TextInput";

export function buildComponent({
  key,
  type,
  label,
}: {
  key: string;
  type: string;
  label?: string | undefined;
}) {
  if (type === "boolean")
    return <BooleanInput key={key} name={key} label={label} />;
  else return <TextInput key={key} name={key} label={label} />;
}
