import type { UIComponent } from "./types";

import { match, P } from "ts-pattern";

import { BooleanInput } from "./components/BooleanInput";
import { DateInput } from "./components/DateInput";
import { NumberInput } from "./components/NumberInput";
import { TextInput } from "./components/TextInput";
import { TextAreaInput } from "./components/TextAreaInput";
import { SelectInput } from "./components/SelectInput";

export function buildComponent({
  key,
  type,
  label,
  uiComponent,
  placeholder,
  autocomplete,
  options,
}: {
  key: string;
  type: string;
  label?: string | undefined;
  uiComponent?: UIComponent;
  placeholder?: string | undefined;
  autocomplete?: string | undefined;
  options?: string[] | undefined;
}) {
  const hasOptions = options && options.length >= 1;

  return match([type, uiComponent, hasOptions])
    .with(["boolean", P._, P._], () => (
      <BooleanInput key={key} name={key} label={label} />
    ))
    .with(["integer", P._, P._], () => (
      <NumberInput
        key={key}
        name={key}
        label={label}
        autocomplete={autocomplete}
        placeholder={placeholder}
      />
    ))
    .with(["string", "datepicker", P._], () => (
      <DateInput key={key} name={key} label={label} />
    ))
    .with(["string", "textarea", P._], () => (
      <TextAreaInput key={key} name={key} label={label} />
    ))
    .with(["string", P._, true], () => (
      <SelectInput key={key} name={key} label={label} options={options!} />
    ))
    .otherwise(() => (
      <TextInput
        key={key}
        name={key}
        label={label}
        autocomplete={autocomplete}
        placeholder={placeholder}
      />
    ));
}
