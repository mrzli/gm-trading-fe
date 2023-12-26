import React from 'react';

export interface TickerDataLayoutProps {
  readonly main: React.ReactNode;
  readonly top?: React.ReactNode;
  readonly bottom?: React.ReactNode;
  readonly left?: React.ReactNode;
  readonly right?: React.ReactNode;
}

export function TickerDataLayout({
  main,
  top,
  bottom,
  left,
  right,
}: TickerDataLayoutProps): React.ReactElement {
  return (
    <div className='h-screen flex flex-col gap-2 p-2 overflow-hidden'>
      {top}
      <div className='flex-1 overflow-hidden flex flex-row gap-2'>
        {left ? (
          <div className='h-full overflow-hidden'>{left}</div>
        ) : undefined}
        <div className='h-full flex-1 overflow-hidden'>{main}</div>
        {right ? (
          <div className='h-full overflow-hidden'>{right}</div>
        ) : undefined}
      </div>
      {bottom}
    </div>
  );
}
