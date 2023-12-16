import React from 'react';

export interface ButtonProps {
  readonly label: string;
  readonly onClick: () => void;
}

export function Button({ label, onClick }: ButtonProps): React.ReactElement {
  return (
    <button
      className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
      onClick={onClick}
    >
      {label}
    </button>
  );
}
