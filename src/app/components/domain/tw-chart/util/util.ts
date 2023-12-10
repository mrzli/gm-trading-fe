import { TwSelectOption } from '../components/TwSelectButton';

export function toSimpleTwSelectOption<TValue extends string>(
  value: TValue,
): TwSelectOption<TValue> {
  return {
    label: value,
    value,
  };
}
