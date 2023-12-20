import React, { CSSProperties, useCallback } from 'react';
import cls from 'classnames';

export interface ToggleButtonProps {
  readonly label: string;
  readonly value: boolean;
  readonly onValueChange: (value: boolean) => void;
  readonly disabled?: boolean;
  readonly width?: CSSProperties['width'];
}

export function ToggleButton({
  label,
  value,
  onValueChange,
  disabled,
  width,
}: ToggleButtonProps): React.ReactElement {
  const checked = value && !disabled;
  const unchecked = !value && !disabled;

  const classes = cls('px-1 text-sm border rounded select-none', {
    'border-slate-400 bg-slate-300': checked,
    'border-slate-400 bg-slate-100': unchecked,
    'border-slate-200 bg-slate-100 text-gray-400 cursor-not-allowed': disabled,
  });

  const handleClick = useCallback(() => {
    onValueChange(!value);
  }, [value, onValueChange]);

  return (
    <button
      className={classes}
      style={{ width }}
      onClick={handleClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}
