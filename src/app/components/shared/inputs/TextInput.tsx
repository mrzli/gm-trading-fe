import React, { useCallback } from 'react';

export interface TextInputProps {
  readonly placeholder?: string;
  readonly value: string;
  readonly onValueChange: (value: string) => void;
}

export function TextInput({
  placeholder,
  value,
  onValueChange,
}: TextInputProps): React.ReactElement {
  const handleValueChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onValueChange(event.target.value);
    },
    [onValueChange],
  );

  return (
    <input
      className='block w-full px-2 py-1 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
      placeholder={placeholder}
      value={value}
      onChange={handleValueChange}
    />
  );
}
