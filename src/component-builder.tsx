import { BooleanInput } from "./components/BooleanInput";
import { DateInput } from "./components/DateInput";
import { NumberInput } from "./components/NumberInput";
import { TextInput } from "./components/TextInput";
import { match, P } from "ts-pattern";

export function buildComponent({
  key,
  type,
  label,
  uiComponent,
  placeholder,
  autocomplete,
}: {
  key: string;
  type: string;
  label?: string | undefined;
  uiComponent?: string | undefined;
  placeholder?: string | undefined;
  autocomplete?: string | undefined;
}) {
  return match([type, uiComponent])
    .with(["boolean", P._], () => (
      <BooleanInput key={key} name={key} label={label} />
    ))
    .with(["integer", P._], () => (
      <NumberInput
        key={key}
        name={key}
        label={label}
        autocomplete={autocomplete}
        placeholder={placeholder}
      />
    ))
    .with(["string", "datepicker"], () => (
      <DateInput key={key} name={key} label={label} />
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
