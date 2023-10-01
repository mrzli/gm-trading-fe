import React, { useCallback } from 'react';

export interface SelectInputOption {
  readonly value: string;
  readonly label: string;
}

export interface SelectInputProps {
  readonly options: readonly SelectInputOption[];
  readonly value: string;
  readonly onValueChange: (value: string) => void;
}

export function SelectInput({
  options,
  value,
  onValueChange,
}: SelectInputProps): React.ReactElement {
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      onValueChange(event.target.value);
    },
    [onValueChange],
  );

  return (
    <select
      className='block w-full px-2 py-1 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
      defaultValue={undefined}
      value={value}
      onChange={handleChange}
    >
      <option value='' disabled={true} hidden={true}>
        Select an option
      </option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
