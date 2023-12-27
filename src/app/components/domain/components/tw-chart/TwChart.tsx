/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UTCTimestamp, createChart } from 'lightweight-charts';
import {
  TickerDataRow,
  TickerDataRows,
  ChartTimezone,
  ChartRange,
} from '../../types';
import { ChartTimeRangeChangeFn, TwChartApi, TwInitInput } from './types';
import {
  destroyChart,
  getTwInitInput,
  initChart,
  utcToTzTimestamp,
} from './util';
import { TwOhlcLabel } from './components/TwOhlcLabel';

export interface TwChartProps {
  readonly precision: number;
  readonly data: TickerDataRows;
  readonly timezone: ChartTimezone;
  readonly logicalRange: ChartRange | undefined;
  readonly onChartTimeRangeChange: ChartTimeRangeChangeFn;
  readonly onChartKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
}

export function TwChart({
  precision,
  data,
  timezone,
  logicalRange,
  onChartTimeRangeChange,
  onChartKeyDown,
}: TwChartProps): React.ReactElement {
  const chartElementRef = useRef<HTMLDivElement>(null);

  const [currCrosshairItem, setCurrCrosshairItem] = useState<
    TickerDataRow | undefined
  >(undefined);

  const [chartApi, setChartApi] = useState<TwChartApi | undefined>(undefined);

  const adjustedData = useMemo<TickerDataRows>(
    () => data.map((row) => adjustRowForTimezone(row, timezone)),
    [data, timezone],
  );

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

    const currentLogicalRange = chartApi.getTimeRange();
    if (!isLogicalRangeEqual(currentLogicalRange, logicalRange)) {
      chartApi.setTimeRange(logicalRange);
    }
  }, [logicalRange, chartApi]);

  useEffect(() => {
    if (!chartApi) {
      return;
    }

    chartApi.setData(adjustedData);
  }, [adjustedData, chartApi]);

  return (
    <div className='h-full overflow-hidden relative'>
      <div>
        {getOhlcLabelElement(
          currCrosshairItem ?? adjustedData.at(-1),
          precision,
        )}
      </div>
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

function adjustRowForTimezone(
  row: TickerDataRow,
  timezone: ChartTimezone,
): TickerDataRow {
  const adjustedTimestamp = utcToTzTimestamp(row.time, timezone);
  return { ...row, time: adjustedTimestamp as UTCTimestamp };
}

function isLogicalRangeEqual(
  lr1: ChartRange | undefined,
  lr2: ChartRange | undefined,
): boolean {
  if (!lr1 && !lr2) {
    return true;
  }
  if (!lr1 || !lr2) {
    return false;
  }
  return equalEpsilon(lr1.from, lr2.from) && equalEpsilon(lr1.to, lr2.to);
}

const EPSILON = 0.001;

function equalEpsilon(a: number, b: number): boolean {
  return Math.abs(a - b) < EPSILON;
}
