import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createChart } from 'lightweight-charts';
import { TickerDataRow } from '../../../../types';
import { CrosshairMoveFn, TwInitInput } from './types';
import { destroyChart, getTwInitInput, initChart } from './util';
import { TwOhlcLabel } from './TwOhlcLabel';

export interface TwChartProps {
  readonly precision: number;
  readonly data: readonly TickerDataRow[];
}

export function TwChart({ precision, data }: TwChartProps): React.ReactElement {
  const elementRef = useRef<HTMLDivElement>(null);

  const [currCrosshairItem, setCurrCrosshairItem] = useState<
    TickerDataRow | undefined
  >(undefined);

  const handleCrosshairMove = useCallback<CrosshairMoveFn>(
    (param) => {
      setCurrCrosshairItem(param);
    },
    [setCurrCrosshairItem],
  );

  const input = useMemo<TwInitInput>(
    () => getTwInitInput(precision, data, handleCrosshairMove),
    [precision, data, handleCrosshairMove],
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
    <div className='h-full overflow-hidden relative'>
      {getOhlcLabelElement(currCrosshairItem, precision)}
      <div ref={elementRef} className='h-full' />
    </div>
  );
}

function getOhlcLabelElement(
  currCrosshairItem: TickerDataRow | undefined,
  precision: number,
): React.ReactElement | undefined {
  if (!currCrosshairItem) {
    return undefined;
  }

  const { open, high, low, close } = currCrosshairItem;

  return (
    <div className='absolute top-1 left-1 z-10'>
      <TwOhlcLabel o={open} h={high} l={low} c={close} precision={precision} />
    </div>
  );
}
