/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createChart } from 'lightweight-charts';
import { Instrument } from '@gmjs/gm-trading-shared';
import { Bars, ChartRange, ChartSettings, TradeLine } from '../../types';
import {
  ChartBar,
  ChartBars,
  ChartMouseClickData,
  ChartMouseClickFn,
  ChartMouseClickInternalData,
  TwChartApi,
  TwInitInput,
} from './types';
import { destroyChart, getChartBars, getTwInitInput, initChart } from './util';
import { TwOhlcLabel } from './components/TwOhlcLabel';
import { isChartRangeEqual } from '../../util';
import { CreateOrderStateAny } from '../ticker-data-container/types';
import { TwCreateOrderStateDisplay } from './components/TwCreateOrderStateDisplay';

export interface TwChartProps {
  readonly settings: ChartSettings;
  readonly instrument: Instrument;
  readonly data: Bars;
  readonly logicalRange: ChartRange | undefined;
  readonly onLogicalRangeChange: (logicalRange: ChartRange | undefined) => void;
  readonly onChartKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  readonly onChartClick?: (data: ChartMouseClickData) => void;
  readonly onChartDoubleClick?: (data: ChartMouseClickData) => void;
  readonly tradeLines: readonly TradeLine[];
  readonly createOrderState: CreateOrderStateAny;
}

export function TwChart({
  settings,
  instrument,
  data,
  logicalRange,
  onLogicalRangeChange,
  onChartKeyDown,
  onChartClick,
  onChartDoubleClick,
  tradeLines,
  createOrderState,
}: TwChartProps): React.ReactElement {
  const { timezone } = settings;
  const { precision } = instrument;

  const chartElementRef = useRef<HTMLDivElement>(null);

  const [currCrosshairItem, setCurrCrosshairItem] = useState<
    ChartBar | undefined
  >(undefined);

  const [chartApi, setChartApi] = useState<TwChartApi | undefined>(undefined);

  const handleChartClick = useCallback<ChartMouseClickFn>(
    (data) => {
      onChartClick?.(toChartClickMouseData(data));
    },
    [onChartClick],
  );

  const handleChartDoubleClick = useCallback<ChartMouseClickFn>(
    (data) => {
      onChartDoubleClick?.(toChartClickMouseData(data));
    },
    [onChartDoubleClick],
  );

  const input = useMemo<TwInitInput>(
    () =>
      getTwInitInput(
        precision,
        setCurrCrosshairItem,
        handleChartClick,
        handleChartDoubleClick,
        onLogicalRangeChange,
      ),
    [precision, handleChartClick, handleChartDoubleClick, onLogicalRangeChange],
  );

  const chartBars = useMemo<ChartBars>(() => {
    return getChartBars(data, timezone);
  }, [data, timezone]);

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

  useEffect(() => {
    if (!chartApi) {
      return;
    }

    chartApi.plugins.setTradeLines(tradeLines);
  }, [tradeLines, chartApi]);

  return (
    <div className='h-full overflow-hidden relative'>
      <div>
        {getChartStatusDisplay(
          currCrosshairItem ?? chartBars.at(-1),
          precision,
          createOrderState,
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

function getChartStatusDisplay(
  currCrosshairItem: ChartBar | undefined,
  precision: number,
  createOrderState: CreateOrderStateAny,
): React.ReactElement | undefined {
  if (!currCrosshairItem) {
    return undefined;
  }

  const { open, high, low, close } = currCrosshairItem;

  return (
    <div className='absolute top-1 left-1 z-10'>
      <div className='flex flex-row gap-2'>
        <TwOhlcLabel
          o={open}
          h={high}
          l={low}
          c={close}
          precision={precision}
        />
        {createOrderState.type === 'start' ? undefined : (
          <TwCreateOrderStateDisplay state={createOrderState} precision={precision} />
        )}
      </div>
    </div>
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
