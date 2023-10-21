import { useFormContext } from "react-hook-form";

export function SelectInput({
  name,
  label = "Label",
  autocomplete = "off",
  placeholder = "",
  options,
  required,
}: {
  name: string;
  label: string | undefined;
  autocomplete?: string | undefined;
  placeholder?: string | undefined;
  options: string[];
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
      <span style={{ color: "red" }}>
        {errors?.[name] && errors[name].message}
      </span>
    </>
  );
}
