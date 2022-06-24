import React from "react";
import { useFormContext } from "react-hook-form";

export function TextAreaInput({
  name,
  label = "Label",
  autocomplete = "off",
  placeholder = "",
}: {
  name: string;
  label: string | undefined;
  autocomplete?: string | undefined;
  placeholder?: string | undefined;
}) {
  const { register } = useFormContext(); // retrieve all hook methods

  return (
    <label>
      {label}
      <br />
      <textarea
        {...register(name)}
        autoComplete={autocomplete}
        placeholder={placeholder}
      />
    </label>
  );
}
