import { Controller, useFormContext } from "react-hook-form";

export function BooleanInput({
  name,
  label = "Label",
  required,
}: {
  name: string;
  label?: string | undefined;
  required: boolean;
}) {
  const {
    control,
    formState: { errors },
  } = useFormContext(); // retrieve all hook methods

  return (
    <label>
      {label} {required ? "*" : ""}
      <br />
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <>
            <label>
              Oui
              <input
                type="radio"
                onBlur={onBlur} // notify when input is touched
                onChange={() => onChange(true)} // send value to hook form
                checked={value === true}
                ref={ref}
              />
            </label>
            <label>
              Non
              <input
                type="radio"
                onBlur={onBlur} // notify when input is touched
                onChange={() => onChange(false)} // send value to hook form
                checked={value === false}
                ref={ref}
              />
            </label>
            <span style={{ color: "red" }}>
              {errors?.[name] && errors[name].message}
            </span>
          </>
        )}
      />
    </label>
  );
}
