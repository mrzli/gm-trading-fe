import React, { CSSProperties, useMemo } from 'react';
import { SelectButton } from './SelectButton';
import {
  SelectOption,
  TwSelectValue,
  TwSelectionRenderer,
  TwSelectItemRenderer,
} from './types';

export interface SelectButtonCenteredProps<
  TValue extends string,
  TAllowUndefined extends boolean,
> {
  readonly placeholder?: string;
  readonly options: readonly SelectOption<TValue>[];
  readonly value: TwSelectValue<TValue, TAllowUndefined>;
  readonly onValueChange: (
    value: TwSelectValue<TValue, TAllowUndefined>,
  ) => void;
  readonly width?: CSSProperties['width'];
}

export function SelectButtonCentered<
  TValue extends string = string,
  TAllowUndefined extends boolean = false,
>({
  placeholder,
  options,
  value,
  onValueChange,
  width,
}: SelectButtonCenteredProps<TValue, TAllowUndefined>): React.ReactElement {
  const selectionRenderer = useMemo<TwSelectionRenderer<TValue>>(
    // eslint-disable-next-line react/display-name
    () => (option) => (
      <div className='px-1 inline-flex justify-center' style={{ width }}>
        {option?.label ?? placeholder}
      </div>
    ),
    [placeholder, width],
  );

  const selectItemRenderer = useMemo<TwSelectItemRenderer<TValue>>(
    // eslint-disable-next-line react/display-name
    () => (option) => (
      <div className='px-1 inline-flex justify-center' style={{ width }}>
        {option.label}
      </div>
    ),
    [width],
  );

  return (
    <SelectButton<TValue, TAllowUndefined>
      options={options}
      value={value}
      onValueChange={onValueChange}
      selectionRenderer={selectionRenderer}
      selectItemRenderer={selectItemRenderer}
    />
  );
}
