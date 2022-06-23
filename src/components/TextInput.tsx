import React from "react";
import { useFormContext } from "react-hook-form";

export function TextInput({
  name,
  label = "Label",
}: {
  name: string;
  label: string | undefined;
}) {
  const { register } = useFormContext(); // retrieve all hook methods

  return (
    <label>
      {label}
      <input type="text" {...register(name)} />
    </label>
  );
}
