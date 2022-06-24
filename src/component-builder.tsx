import { BooleanInput } from "./components/BooleanInput";
import { DateInput } from "./components/DateInput";
import { NumberInput } from "./components/NumberInput";
import { TextInput } from "./components/TextInput";

export function buildComponent({
  key,
  type,
  label,
  uiComponent,
}: {
  key: string;
  type: string;
  label?: string | undefined;
  uiComponent?: string | undefined;
}) {
  switch (type) {
    case "boolean": {
      return <BooleanInput key={key} name={key} label={label} />;
    }
    case "integer": {
      return <NumberInput key={key} name={key} label={label} />;
    }
    case "string": {
      switch (uiComponent) {
        case "datepicker": {
          return <DateInput key={key} name={key} label={label} />;
        }
      }
      break;
    }
    default: {
      return <TextInput key={key} name={key} label={label} />;
    }
  }
}
