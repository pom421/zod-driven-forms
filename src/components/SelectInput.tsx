import React from "react";
import { useFormContext } from "react-hook-form";

export function SelectInput({
  name,
  label = "Label",
  autocomplete = "off",
  placeholder = "",
  options,
}: {
  name: string;
  label: string | undefined;
  autocomplete?: string | undefined;
  placeholder?: string | undefined;
  options: string[];
}) {
  const { register } = useFormContext(); // retrieve all hook methods

  return (
    <label>
      {label}
      <select
        {...register(name)}
        autoComplete={autocomplete}
        placeholder={placeholder}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
