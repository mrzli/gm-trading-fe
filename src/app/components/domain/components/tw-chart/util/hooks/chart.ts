import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ChartBar,
  ChartBars,
  ChartInitInput,
  ChartMouseClickData,
  ChartMouseClickFn,
  ChartMouseClickInternalData,
  ChartMouseClickInternalFn,
  ChartSubscribeInput,
  TwChartApi,
} from '../../types';
import { createChart } from 'lightweight-charts';
import { destroyChart, initChart, subscribeToChartEvents } from '../lifecycle';
import { Bars, ChartRange, ChartSettings, TradeLine } from '../../../../types';
import { Instrument } from '@gmjs/gm-trading-shared';
import { getChartBars } from '../chart-bars';

export interface UseTwChartResult {
  readonly chartElementRef: React.RefObject<HTMLDivElement>;
  readonly chartApi: TwChartApi | undefined;
}

export function useTwChart(
  settings: ChartSettings,
  instrument: Instrument,
): UseTwChartResult {
  const { precision } = instrument;

  const chartElementRef = useRef<HTMLDivElement>(null);

  const [chartApi, setChartApi] = useState<TwChartApi | undefined>(undefined);

  const chartInitInput = useMemo<ChartInitInput>(() => {
    return {
      precision,
    };
  }, [precision]);

  useEffect(() => {
    const c = chartElementRef.current
      ? createChart(chartElementRef.current)
      : undefined;
    const chartApi = initChart(settings, instrument, c, chartInitInput);
    setChartApi(chartApi);

    return () => {
      destroyChart(c);
    };
  }, [chartInitInput, instrument, settings]);

  return {
    chartElementRef,
    chartApi,
  };
}

export interface UseTwChartSubscribeResult {
  readonly currCrosshairItem: ChartBar | undefined;
}

export function useTwChartSubscribe(
  chartApi: TwChartApi | undefined,
  handleChartClick: ChartMouseClickFn | undefined,
  handleChartDoubleClick: ChartMouseClickFn | undefined,
  handleTimeRangeChange: (range: ChartRange | undefined) => void,
): UseTwChartSubscribeResult {
  const [currCrosshairItem, setCurrCrosshairItem] = useState<
    ChartBar | undefined
  >(undefined);

  const handleChartInternalClick = useChartClickHandler(handleChartClick);
  const handleChartDoubleInternalClick = useChartClickHandler(
    handleChartDoubleClick,
  );

  const chartSubscribeInput = useMemo<ChartSubscribeInput>(() => {
    return {
      onCrosshairMove: setCurrCrosshairItem,
      onChartClick: handleChartInternalClick,
      onChartDoubleClick: handleChartDoubleInternalClick,
      onChartTimeRangeChange: handleTimeRangeChange,
    };
  }, [
    handleChartDoubleInternalClick,
    handleChartInternalClick,
    handleTimeRangeChange,
  ]);

  useEffect(() => {
    if (!chartApi) {
      return;
    }

    const result = subscribeToChartEvents(chartSubscribeInput, chartApi);

    return () => {
      result.unsubscribe();
    };
  }, [chartApi, chartSubscribeInput]);

  return {
    currCrosshairItem,
  }
}

function useChartClickHandler(
  handler: ChartMouseClickFn | undefined,
): ChartMouseClickInternalFn {
  return useCallback<ChartMouseClickInternalFn>(
    (data: ChartMouseClickInternalData) => {
      handler?.(toChartClickMouseData(data));
    },
    [handler],
  );
}

function toChartClickMouseData(
  input: ChartMouseClickInternalData,
): ChartMouseClickData {
  const { index, price } = input;

  return {
    barIndex: index,
    price,
  };
}

export function useChartBars(data: Bars, timezone: string): ChartBars {
  return useMemo<ChartBars>(() => {
    return getChartBars(data, timezone);
  }, [data, timezone]);
}

export function useTradeLines(
  chartApi: TwChartApi | undefined,
  tradeLines: readonly TradeLine[],
): void {
  useEffect(() => {
    if (!chartApi) {
      return;
    }

    chartApi.plugins.setTradeLines(tradeLines);
  }, [tradeLines, chartApi]);
}
