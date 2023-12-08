import React, { useEffect, useMemo, useRef } from 'react';
import { createChart } from 'lightweight-charts';
import { TickerDataRow } from '../../../../types';
import { TwInitInput } from './types';
import { destroyChart, getTwInitInput, initChart } from './util';

export interface TwChartProps {
  readonly precision: number;
  readonly data: readonly TickerDataRow[];
}

export function TwChart({ precision, data }: TwChartProps): React.ReactElement {
  const elementRef = useRef<HTMLDivElement>(null);

  const input = useMemo<TwInitInput>(
    () => getTwInitInput(precision, data),
    [precision, data],
  );

  useEffect(() => {
    const chart = elementRef.current
      ? createChart(elementRef.current)
      : undefined;
    initChart(chart, input);

    return () => {
      destroyChart(chart);
    };
  }, [input]);

  return (
    <div className='h-full overflow-hidden'>
      <div ref={elementRef} className='h-full' />
    </div>
  );
}
