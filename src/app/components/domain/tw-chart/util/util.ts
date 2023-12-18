import { SelectOption } from '../../../shared';

export function toSimpleSelectOption<TValue extends string>(
  value: TValue,
): SelectOption<TValue> {
  return {
    label: value,
    value,
  };
}
