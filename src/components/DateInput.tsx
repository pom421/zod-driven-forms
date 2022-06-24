import React from "react";
import { useFormContext } from "react-hook-form";

export function DateInput({
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
      <input type="date" placeholder="Date" {...register(name)} />
    </label>
  );
}
