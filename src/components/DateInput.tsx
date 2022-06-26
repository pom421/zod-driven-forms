import React from "react";
import { useFormContext } from "react-hook-form";

export function DateInput({
  name,
  label = "Label",
  required,
}: {
  name: string;
  label: string | undefined;
  required: boolean;
}) {
  const { register } = useFormContext(); // retrieve all hook methods

  return (
    <label>
      {label} {required ? "*" : ""}
      <input type="date" placeholder="Date" {...register(name)} />
    </label>
  );
}
