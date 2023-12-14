/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { CSSProperties, useCallback, useMemo, useState } from 'react';
import {
  TwSelectItemRenderer,
  TwSelectOption,
  TwSelectValue,
  TwSelectionRenderer,
} from './types';
import { Popover } from './Popover';

export interface TwSelectButtonProps<
  TValue extends string,
  TAllowUndefined extends boolean,
> {
  readonly placeholder?: string;
  readonly options: readonly TwSelectOption<TValue>[];
  readonly value: TwSelectValue<TValue, TAllowUndefined>;
  readonly onValueChange: (
    value: TwSelectValue<TValue, TAllowUndefined>,
  ) => void;
  readonly selectionRenderer?: TwSelectionRenderer<TValue>;
  readonly selectItemRenderer?: TwSelectItemRenderer<TValue>;
  readonly selectionWidth?: CSSProperties['width'];
  readonly selectItemWidth?: CSSProperties['width'];
}

export function TwSelectButton<
  TValue extends string = string,
  TAllowUndefined extends boolean = false,
>({
  placeholder,
  options,
  value,
  onValueChange,
  selectionRenderer,
  selectItemRenderer,
  selectionWidth,
  selectItemWidth,
}: TwSelectButtonProps<TValue, TAllowUndefined>): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = useCallback(
    (v: TValue, _index: number) => {
      setIsOpen(false);
      onValueChange(v);
    },
    [onValueChange, setIsOpen],
  );

  const selectedOption = useMemo(() => {
    return options.find((o) => o.value === value);
  }, [options, value]);

  const finalSelectionRenderer = useMemo<TwSelectionRenderer<TValue>>(() => {
    return (
      selectionRenderer ??
      ((o): React.ReactNode => (
        <div className='px-1' style={{ width: selectionWidth }}>
          {o?.label ?? placeholder}
        </div>
      ))
    );
  }, [selectionRenderer, placeholder, selectionWidth]);

  const finalSelectItemRenderer = useMemo<TwSelectItemRenderer<TValue>>(() => {
    return (
      selectItemRenderer ??
      ((o): React.ReactNode => (
        <div className='px-1' style={{ width: selectItemWidth }}>
          {o.label}
        </div>
      ))
    );
  }, [selectItemRenderer, selectItemWidth]);

  const trigger = (
    <div className='text-sm border rounded border-slate-400 bg-slate-100 cursor-pointer outline-none inline-flex items-center min-h-[24px] min-w-[24px] select-none'>
      {finalSelectionRenderer(selectedOption)}
    </div>
  );

  const content = (
    <div className='text-sm border rounded border-slate-400 bg-slate-100 overflow-y-auto bg-white outline-none'>
      {options.map((o, i) => (
        <div
          key={o.value}
          className={'cursor-pointer hover:bg-slate-200'}
          onClick={() => {
            handleSelect(o.value, i);
          }}
        >
          {finalSelectItemRenderer(o)}
        </div>
      ))}
    </div>
  );

  return (
    <Popover
      trigger={trigger}
      content={content}
      open={isOpen}
      onOpenChange={setIsOpen}
    />
  );
}
