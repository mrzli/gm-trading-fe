import React, { useCallback } from 'react';

export interface CheckboxProps {
  readonly label?: string;
  readonly value: boolean;
  readonly onValueChange: (value: boolean) => void;
}

export function Checkbox({
  label,
  value,
  onValueChange,
}: CheckboxProps): React.ReactElement {
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onValueChange(event.target.checked);
    },
    [onValueChange],
  );

  return (
    <div className='appearance-none'>
      <label className='flex flex-row gap-1 items-center'>
        <input
          className='h-4 w-4 rounded border-slate-300 text-slate-600 focus:ring-0 focus:ring-offset-0'
          type='checkbox'
          checked={value}
          onChange={handleChange}
        />
        {label && <span className='text-sm'>{label}</span>}
      </label>
    </div>
  );
}
