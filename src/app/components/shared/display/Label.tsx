import React from 'react';

export interface LabelProps {
  readonly htmlFor?: string;
  readonly content: React.ReactNode;
}

export function Label({
  htmlFor,
  content,
}: LabelProps): React.ReactElement {
  return (
    <label htmlFor={htmlFor} className='text-[10px] leading-none'>
      {content}
    </label>
  );
}
