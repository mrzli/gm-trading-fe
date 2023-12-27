/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UTCTimestamp, createChart } from 'lightweight-charts';
import { Bar, Bars, ChartTimezone, ChartRange } from '../../types';
import { TwChartApi, TwInitInput } from './types';
import {
  destroyChart,
  getTwInitInput,
  initChart,
  utcToTzTimestamp,
} from './util';
import { TwOhlcLabel } from './components/TwOhlcLabel';
import { isChartRangeEqual } from '../../util';

export interface TwChartProps {
  readonly precision: number;
  readonly data: Bars;
  readonly timezone: ChartTimezone;
  readonly logicalRange: ChartRange | undefined;
  readonly onLogicalRangeChange: (logicalRange: ChartRange | undefined) => void;
  readonly onChartKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
}

export function TwChart({
  precision,
  data,
  timezone,
  logicalRange,
  onLogicalRangeChange,
  onChartKeyDown,
}: TwChartProps): React.ReactElement {
  const chartElementRef = useRef<HTMLDivElement>(null);

  const [currCrosshairItem, setCurrCrosshairItem] = useState<Bar | undefined>(
    undefined,
  );

  const [chartApi, setChartApi] = useState<TwChartApi | undefined>(undefined);

  const adjustedData = useMemo<Bars>(
    () => data.map((item) => adjustBarForTimezone(item, timezone)),
    [data, timezone],
  );

  const input = useMemo<TwInitInput>(
    () => getTwInitInput(precision, setCurrCrosshairItem, onLogicalRangeChange),
    [precision, onLogicalRangeChange],
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
    if (!isChartRangeEqual(currentLogicalRange, logicalRange)) {
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
  currCrosshairItem: Bar | undefined,
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

function adjustBarForTimezone(bar: Bar, timezone: ChartTimezone): Bar {
  const adjustedTimestamp = utcToTzTimestamp(bar.time, timezone);
  return { ...bar, time: adjustedTimestamp as UTCTimestamp };
}
