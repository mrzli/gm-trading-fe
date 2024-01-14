/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import { Instrument } from '@gmjs/gm-trading-shared';
import { Bars, ChartRange, ChartSettings } from '../../types';
import { ChartBar, ChartBars, TwChartApi, TwInitInput } from './types';
import { destroyChart, getChartBars, getTwInitInput, initChart } from './util';
import { TwOhlcLabel } from './components/TwOhlcLabel';
import { isChartRangeEqual } from '../../util';

export interface TwChartProps {
  readonly settings: ChartSettings;
  readonly instrument: Instrument;
  readonly data: Bars;
  readonly logicalRange: ChartRange | undefined;
  readonly onLogicalRangeChange: (logicalRange: ChartRange | undefined) => void;
  readonly onChartKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
}

export function TwChart({
  settings,
  instrument,
  data,
  logicalRange,
  onLogicalRangeChange,
  onChartKeyDown,
}: TwChartProps): React.ReactElement {
  const { timezone } = settings;
  const { precision } = instrument;

  const chartElementRef = useRef<HTMLDivElement>(null);

  const [currCrosshairItem, setCurrCrosshairItem] = useState<
    ChartBar | undefined
  >(undefined);

  const [chartApi, setChartApi] = useState<TwChartApi | undefined>(undefined);

  const chartBars = useMemo<ChartBars>(() => {
    return getChartBars(data, timezone);
  }, [data, timezone]);

  const input = useMemo<TwInitInput>(
    () => getTwInitInput(precision, setCurrCrosshairItem, onLogicalRangeChange),
    [precision, onLogicalRangeChange],
  );

  useEffect(() => {
    const c = chartElementRef.current
      ? createChart(chartElementRef.current)
      : undefined;
    const chartApi = initChart(settings, instrument, c, input);
    setChartApi(chartApi);

    return () => {
      destroyChart(c);
    };
  }, [input, instrument, settings]);

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

    chartApi.setData(chartBars);
  }, [chartBars, chartApi]);

  return (
    <div className='h-full overflow-hidden relative'>
      <div>
        {getOhlcLabelElement(currCrosshairItem ?? chartBars.at(-1), precision)}
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
  currCrosshairItem: ChartBar | undefined,
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
