import type { UIComponent } from "../types";

import { match, P } from "ts-pattern";

import { BooleanInput } from "../components/BooleanInput";
import { DateInput } from "../components/DateInput";
import { NumberInput } from "../components/NumberInput";
import { TextInput } from "../components/TextInput";
import { TextAreaInput } from "../components/TextAreaInput";
import { SelectInput } from "../components/SelectInput";

/**
 * Note :
 * - une value d'un input html est forcément un string, string[], number ou undefined.
 * React.InputHTMLAttributes<HTMLInputElement>.value?: string | number | readonly string[] | undefined
 *
 */

export function buildComponent({
  key,
  type,
  label,
  uiComponent,
  placeholder,
  autocomplete,
  options,
  required,
}: {
  key: string;
  type: string;
  label?: string | undefined;
  uiComponent?: UIComponent;
  placeholder?: string | undefined;
  autocomplete?: string | undefined;
  options?: string[] | undefined;
  required: boolean;
}) {
  const hasOptions = options && options.length >= 1;

  return match([type, uiComponent, hasOptions])
    .with(["boolean", P._, P._], () => (
      <BooleanInput key={key} name={key} label={label} required={required} />
    ))
    .with(["integer", P._, P._], () => (
      <NumberInput
        key={key}
        name={key}
        label={label}
        required={required}
        autocomplete={autocomplete}
        placeholder={placeholder}
      />
    ))
    .with(["string", "datepicker", P._], () => (
      <DateInput key={key} name={key} label={label} required={required} />
    ))
    .with(["string", "textarea", P._], () => (
      <TextAreaInput key={key} name={key} label={label} required={required} />
    ))
    .with(["string", P._, true], () => (
      <SelectInput
        key={key}
        name={key}
        label={label}
        required={required}
        options={options!}
      />
    ))
    .otherwise(() => (
      <TextInput
        key={key}
        name={key}
        label={label}
        required={required}
        autocomplete={autocomplete}
        placeholder={placeholder}
      />
    ));
}
