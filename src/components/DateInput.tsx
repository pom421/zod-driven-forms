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
  const {
    register,
    formState: { errors },
  } = useFormContext(); // retrieve all hook methods

  return (
    <>
      <label>
        {label} {required ? "*" : ""}
        <input type="date" placeholder="Date" {...register(name)} />
      </label>
      <span style={{ color: "red" }}>
        {errors?.[name] && errors[name].message}
      </span>
    </>
  );
}
