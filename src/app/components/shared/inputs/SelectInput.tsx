import React, { useCallback } from 'react';

type EmptyString = '';

export interface SelectInputOption<TValue extends string = string> {
  readonly value: TValue;
  readonly label: string;
}

export interface SelectInputProps<TValue extends string = string> {
  readonly placeholder?: string;
  readonly options: readonly SelectInputOption<TValue>[];
  readonly value: TValue | EmptyString;
  readonly onValueChange: (value: TValue | EmptyString) => void;
}

export function SelectInput<TValue extends string = string>({
  placeholder,
  options,
  value,
  onValueChange,
}: SelectInputProps<TValue>): React.ReactElement {
  const handleValueChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const value = event.target.value as TValue | EmptyString;
      onValueChange(value);
    },
    [onValueChange],
  );

  return (
    <select
      className='block w-full px-2 py-1 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
      defaultValue={undefined}
      value={value}
      onChange={handleValueChange}
    >
      <option value={''} disabled={true} hidden={true}>
        {placeholder}
      </option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
