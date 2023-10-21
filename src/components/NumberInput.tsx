import { useFormContext } from "react-hook-form";

export function NumberInput({
  name,
  label = "Label",
  autocomplete = "off",
  placeholder = "",
  required,
}: {
  name: string;
  label: string | undefined;
  autocomplete?: string | undefined;
  placeholder?: string | undefined;
  required: boolean;
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext(); // retrieve all hook methods

  return (
    <>
      <label>
        {label} {required ? "*" : ""}
        <input
          type="number"
          {...register(name, { valueAsNumber: true })}
          autoComplete={autocomplete}
          placeholder={placeholder}
        />
      </label>
      <span style={{ color: "red" }}>
        {errors?.[name] && errors[name].message}
      </span>
    </>
  );
}
