import React from 'react';
import { Label } from './Label';

export interface ValueDisplayProps {
  readonly label?: string;
  readonly value: string;
}

export function ValueDisplay({
  label,
  value,
}: ValueDisplayProps): React.ReactElement {
  const contentElement = <div className='text-sm'>{value}</div>;

  return label ? (
    <div className='flex flex-col'>
      <Label content={label} />
      {contentElement}
    </div>
  ) : (
    contentElement
  );
}
