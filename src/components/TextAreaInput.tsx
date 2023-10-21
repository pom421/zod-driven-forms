import { useFormContext } from "react-hook-form";

export function TextAreaInput({
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
        <br />
        <textarea
          {...register(name)}
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
