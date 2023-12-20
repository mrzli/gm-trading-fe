import React, { CSSProperties } from 'react';
import { Label } from './Label';

export interface ValueDisplayProps {
  readonly label?: string;
  readonly fontSize?: CSSProperties['fontSize'];
  readonly value: string;
}

export function ValueDisplay({
  label,
  fontSize,
  value,
}: ValueDisplayProps): React.ReactElement {
  const contentElement = (
    <div
      className='inline-flex items-center min-h-[20px] text-sm'
      style={{ fontSize }}
    >
      {value}
    </div>
  );

  return label ? (
    <div className='flex flex-col'>
      <Label content={label} />
      {contentElement}
    </div>
  ) : (
    contentElement
  );
}
