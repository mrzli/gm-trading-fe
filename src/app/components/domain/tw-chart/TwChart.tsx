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
  readonly timeRange: TwRange | undefined;
  readonly onChartTimeRangeChange: ChartTimeRangeChangeFn;
}

export function TwChart({
  precision,
  data,
  timeRange,
  onChartTimeRangeChange,
}: TwChartProps): React.ReactElement {
  const chartElementRef = useRef<HTMLDivElement>(null);

  const [currCrosshairItem, setCurrCrosshairItem] = useState<
    TickerDataRow | undefined
  >(undefined);

  const [chartApi, setChartApi] = useState<TwChartApi | undefined>(undefined);

  const input = useMemo<TwInitInput>(
    () =>
      getTwInitInput(
        precision,
        data,
        setCurrCrosshairItem,
        onChartTimeRangeChange,
      ),
    [precision, data, setCurrCrosshairItem, onChartTimeRangeChange],
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
    if (!timeRange || !chartApi) {
      return;
    }

    chartApi.setTimeRange(timeRange);
  }, [timeRange, chartApi]);

  return (
    <div className='h-full overflow-hidden relative'>
      <div>{getOhlcLabelElement(currCrosshairItem, precision)}</div>
      <div ref={chartElementRef} className='h-full overflow-hidden' />
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
