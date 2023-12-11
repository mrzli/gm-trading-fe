import React, { CSSProperties, useCallback } from 'react';
import cls from 'classnames';

export interface TwTextInputProps {
  readonly placeholder?: string;
  readonly value: string;
  readonly onValueChange: (value: string) => void;
  readonly disabled?: boolean;
  readonly error?: boolean;
  readonly width?: CSSProperties['width'];
}

export function TwTextInput({
  placeholder,
  value,
  onValueChange,
  disabled,
  error,
  width,
}: TwTextInputProps): React.ReactElement {
  const classes = cls('px-1 outline-none text-sm border rounded', {
    'border-slate-400': !disabled,
    'border-slate-200 text-gray-400 cursor-not-allowed': disabled,
    'border-red-500': error && !disabled,
  });

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onValueChange(event.target.value);
    },
    [onValueChange],
  );

  return (
    <input
      placeholder={placeholder}
      className={classes}
      style={{ width: width }}
      disabled={disabled}
      value={value}
      onChange={handleChange}
    />
  );
}
