import { TwSelectOption } from '../components/form/select-button/TwSelectButton';

export function toSimpleTwSelectOption<TValue extends string>(
  value: TValue,
): TwSelectOption<TValue> {
  return {
    label: value,
    value,
  };
}
