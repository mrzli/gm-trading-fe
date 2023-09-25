import React, { CSSProperties, useMemo } from 'react';
import { Strategy } from '@floating-ui/react';

export interface TooltipDisplayProps extends Record<string, unknown> {
  readonly x: number | null;
  readonly y: number | null;
  readonly strategy: Strategy;
  readonly children: React.ReactNode;
}

function TooltipDisplayInternal(
  { x, y, strategy, children, ...rest }: TooltipDisplayProps,
  ref: React.ForwardedRef<HTMLDivElement>,
): React.ReactElement {
  const styles = useMemo<CSSProperties>(
    () => ({
      position: strategy,
      top: y ?? 0,
      left: x ?? 0,
      width: 'max-content',
      zIndex: 2000,
    }),
    [x, y, strategy],
  );

  return (
    <div
      ref={ref}
      style={styles}
      className='inline-flex border border-slate-500 bg-slate-200 py-2 px-3'
      {...rest}
    >
      {children}
    </div>
  );
}

export const TooltipDisplay = React.forwardRef(TooltipDisplayInternal);
