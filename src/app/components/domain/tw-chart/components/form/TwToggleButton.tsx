import React, { useCallback } from 'react';
import cls from 'classnames';

export interface TwToggleButtonProps {
  readonly label: string;
  readonly value: boolean;
  readonly onValueChange: (value: boolean) => void;
  readonly disabled?: boolean;
}

export function TwToggleButton({
  label,
  value,
  onValueChange,
  disabled,
}: TwToggleButtonProps): React.ReactElement {
  const checked = value && !disabled;
  const unchecked = !value && !disabled;

  const classes = cls('px-1 text-sm border rounded', {
    'border-slate-400 bg-slate-300': checked,
    'border-slate-400 bg-slate-100': unchecked,
    'border-slate-200 bg-slate-100 text-gray-400 cursor-not-allowed': disabled,
  });

  const handleClick = useCallback(() => {
    onValueChange(!value);
  }, [value, onValueChange]);

  return (
    <button className={classes} onClick={handleClick} disabled={disabled}>
      {label}
    </button>
  );
}
