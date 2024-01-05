import React, { CSSProperties, useCallback } from 'react';
import cls from 'classnames';
import { Label } from '../display';

export interface TextInputProps {
  readonly id?: string;
  readonly label?: string;
  readonly placeholder?: string;
  readonly value: string;
  readonly onValueChange: (value: string) => void;
  readonly onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  readonly onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  readonly disabled?: boolean;
  readonly error?: boolean;
  readonly width?: CSSProperties['width'];
}

function TextInputInternal(
  {
    id,
    label,
    placeholder,
    value,
    onValueChange,
    onBlur,
    onKeyDown,
    disabled,
    error,
    width,
  }: TextInputProps,
  ref: React.Ref<HTMLInputElement>,
): React.ReactElement {
  const classes = cls('px-1 outline-none text-sm border rounded min-w-0', {
    'border-slate-400': !error && !disabled,
    'border-slate-200 text-gray-400 cursor-not-allowed': disabled,
    'border-red-500': error && !disabled,
  });

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onValueChange(event.target.value);
    },
    [onValueChange],
  );

  const inputElement = (
    <input
      ref={ref}
      id={id}
      placeholder={placeholder}
      className={classes}
      style={{ width }}
      disabled={disabled}
      value={value}
      onChange={handleChange}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
    />
  );

  return label ? (
    <div className='flex flex-col gap-0.5'>
      <Label htmlFor={id} content={label} />
      {inputElement}
    </div>
  ) : (
    inputElement
  );
}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  TextInputInternal,
);
