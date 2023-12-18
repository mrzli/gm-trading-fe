import React, { CSSProperties, useCallback } from 'react';
import cls from 'classnames';
import { TwLabel } from '../display/TwLabel';

export interface TwTextInputProps {
  readonly id?: string;
  readonly label?: string;
  readonly placeholder?: string;
  readonly value: string;
  readonly onValueChange: (value: string) => void;
  readonly onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  readonly disabled?: boolean;
  readonly error?: boolean;
  readonly width?: CSSProperties['width'];
}

export function TwTextInput({
  id,
  label,
  placeholder,
  value,
  onValueChange,
  onKeyDown,
  disabled,
  error,
  width,
}: TwTextInputProps): React.ReactElement {
  const classes = cls('px-1 outline-none text-sm border rounded', {
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
      id={id}
      placeholder={placeholder}
      className={classes}
      style={{ width: width }}
      disabled={disabled}
      value={value}
      onChange={handleChange}
      onKeyDown={onKeyDown}
    />
  );

  return label ? (
    <div className='flex flex-col'>
      <TwLabel htmlFor={id} content={label} />
      {inputElement}
    </div>
  ) : (
    inputElement
  );
}
