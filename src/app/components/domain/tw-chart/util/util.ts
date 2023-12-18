import { SelectOption } from "../../../shared/input/select-button/types";

export function toSimpleSelectOption<TValue extends string>(
  value: TValue,
): SelectOption<TValue> {
  return {
    label: value,
    value,
  };
}
