import React from "react";
import { useFormContext } from "react-hook-form";

export function TextInput({
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
      <input
        type="text"
        {...register(name)}
        autoComplete={autocomplete}
        placeholder={placeholder}
      />
    </label>
  );
}
