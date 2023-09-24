import React from 'react';

export interface AnotherScreenContentProps {
  readonly text: string;
}

export function AnotherScreenContent({
  text,
}: AnotherScreenContentProps): React.ReactElement {
  return <div className='text-2xl font-bold text-blue-500'>{text}</div>;
}
