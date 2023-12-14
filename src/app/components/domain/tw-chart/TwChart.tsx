/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import { TickerDataRow } from '../../../types';
import {
  ChartTimeRangeChangeFn,
  TwChartApi,
  TwInitInput,
  TwRange,
} from './types';
import { destroyChart, getTwInitInput, initChart } from './util';
import { TwOhlcLabel } from './components/composite/TwOhlcLabel';

export interface TwChartProps {
  readonly precision: number;
  readonly data: readonly TickerDataRow[];
  readonly logicalRange: TwRange | undefined;
  readonly onChartTimeRangeChange: ChartTimeRangeChangeFn;
  readonly onChartKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
}

export function TwChart({
  precision,
  data,
  logicalRange,
  onChartTimeRangeChange,
  onChartKeyDown,
}: TwChartProps): React.ReactElement {
  const chartElementRef = useRef<HTMLDivElement>(null);

  const [currCrosshairItem, setCurrCrosshairItem] = useState<
    TickerDataRow | undefined
  >(undefined);

  const [chartApi, setChartApi] = useState<TwChartApi | undefined>(undefined);

  const input = useMemo<TwInitInput>(
    () =>
      getTwInitInput(precision, setCurrCrosshairItem, onChartTimeRangeChange),
    [precision, onChartTimeRangeChange],
  );

  useEffect(() => {
    const c = chartElementRef.current
      ? createChart(chartElementRef.current)
      : undefined;
    const chartApi = initChart(c, input);
    setChartApi(chartApi);

    return () => {
      destroyChart(c);
    };
  }, [input]);

  useEffect(() => {
    if (!logicalRange || !chartApi) {
      return;
    }

    chartApi.setTimeRange(logicalRange);
  }, [logicalRange, chartApi]);

  useEffect(() => {
    if (!chartApi) {
      return;
    }

    chartApi.setData(data);
  }, [data, chartApi]);

  return (
    <div className='h-full overflow-hidden relative'>
      <div>{getOhlcLabelElement(currCrosshairItem, precision)}</div>
      <div
        ref={chartElementRef}
        tabIndex={0}
        className='h-full overflow-hidden'
        onKeyDown={onChartKeyDown}
      />
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
