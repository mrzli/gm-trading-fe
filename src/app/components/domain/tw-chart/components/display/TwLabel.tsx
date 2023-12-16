import React from 'react';

export interface TwLabelProps {
  readonly htmlFor?: string;
  readonly content: React.ReactNode;
}

export function TwLabel({
  htmlFor,
  content,
}: TwLabelProps): React.ReactElement {
  return (<label htmlFor={htmlFor} className='text-sm'>{content}</label>)
}
