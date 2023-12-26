import { InputType } from '@storybook/types';

export type InputTypeDisableTable = {
  readonly table: { readonly disable: true };
};

export function disableControl(): InputType & InputTypeDisableTable {
  return {
    table: {
      disable: true,
    },
  };
}

export type InputTypeInlineRadio<TOption extends string> = {
  readonly control: {
    readonly type: 'inline-radio';
  };
  readonly options: readonly TOption[];
};

export function argTypeInlineRadio<TOption extends string>(
  options: readonly TOption[],
): InputType & InputTypeInlineRadio<TOption> {
  return {
    control: {
      type: 'inline-radio',
    },
    options,
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

export function printArgs(...args: unknown[]): void {
  console.log('args:', args);
}
