import React from 'react';

export interface TwLabelProps {
  readonly htmlFor?: string;
  readonly content: React.ReactNode;
}

export function TwLabel({
  htmlFor,
  content,
}: TwLabelProps): React.ReactElement {
  return (
    <label htmlFor={htmlFor} className='text-[10px] leading-none'>
      {content}
    </label>
  );
}
