import React, { CSSProperties } from 'react';

export interface LabelProps {
  readonly htmlFor?: string;
  readonly content: React.ReactNode;
  readonly width?: CSSProperties['width'];
}

export function Label({
  htmlFor,
  content,
  width,
}: LabelProps): React.ReactElement {
  return (
    <label
      htmlFor={htmlFor}
      className='text-[10px] leading-none'
      style={{ width }}
    >
      {content}
    </label>
  );
}
