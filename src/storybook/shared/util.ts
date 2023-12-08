import { InputType } from '@storybook/types';

export function disableControl(): InputType & { table: { disable: true } } {
  return {
    table: {
      disable: true,
    },
  };
}

export function argTypeInteger(
  min?: number,
  max?: number,
): InputType & { control: { type: 'number'; min?: number; max?: number } } {
  return {
    control: {
      type: 'number',
      min,
      max,
    },
  };
}
