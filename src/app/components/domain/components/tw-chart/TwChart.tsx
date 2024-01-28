/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect } from 'react';
import { Instrument } from '@gmjs/gm-trading-shared';
import {
  Bars,
  ChartNavigatePayloadAny,
  ChartSettings,
  TradeLine,
} from '../../types';
import { ChartBar, ChartMouseClickData } from './types';
import {
  logicalToLogicalRange,
  useChartBars,
  useTradeLines,
  useTwChart,
  useTwChartSubscribe,
} from './util';
import { TwOhlcLabel } from './components/TwOhlcLabel';
import { CreateOrderStateAny } from '../ticker-data-container/types';
import { TwCreateOrderStateDisplay } from './components/TwCreateOrderStateDisplay';

export interface TwChartProps {
  readonly settings: ChartSettings;
  readonly instrument: Instrument;
  readonly data: Bars;
  readonly navigatePayload: ChartNavigatePayloadAny | undefined;
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
  navigatePayload,
  onChartKeyDown,
  onChartClick,
  onChartDoubleClick,
  tradeLines,
  createOrderState,
}: TwChartProps): React.ReactElement {
  const {
    chartBars,
    visibleChartBars,
    relativeRange,
    handleRelativeRangeChange,
  } = useChartBars(data, settings.timezone, navigatePayload);

  const { chartElementRef, chartApi } = useTwChart(settings, instrument);

  const { currCrosshairItem } = useTwChartSubscribe(
    chartApi,
    onChartClick,
    onChartDoubleClick,
    handleRelativeRangeChange,
  );

  useEffect(() => {
    if (!chartApi) {
      return;
    }

    chartApi.context.setChartRangeUpdateEnabled(false);
    chartApi.setData(visibleChartBars);
    chartApi.context.setChartRangeUpdateEnabled(true);
  }, [chartApi, visibleChartBars]);

  useEffect(() => {
    if (!chartApi) {
      return;
    }

    chartApi.context.setChartRangeUpdateEnabled(false);
    chartApi.setTimeRange(
      logicalToLogicalRange(chartBars.length - 1, undefined, chartBars.length),
    );
    chartApi.context.setChartRangeUpdateEnabled(true);
  }, [chartBars, chartApi]);

  useEffect(
    () => {
      if (!chartApi || !relativeRange) {
        return;
      }

      chartApi.context.setChartRangeUpdateEnabled(false);
      chartApi.setTimeRange(relativeRange);
      chartApi.context.setChartRangeUpdateEnabled(true);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [relativeRange],
  );

  useTradeLines(chartApi, tradeLines);

  return (
    <div className='h-full overflow-hidden relative'>
      <div>
        {getChartStatusDisplay(
          currCrosshairItem ?? chartBars.at(-1),
          instrument.precision,
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
          <TwCreateOrderStateDisplay
            state={createOrderState}
            precision={precision}
          />
        )}
      </div>
    </div>
  );
}
