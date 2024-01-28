/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect } from 'react';
import { Instrument } from '@gmjs/gm-trading-shared';
import {
  Bars,
  ChartNavigatePayloadAny,
  ChartRange,
  ChartSettings,
  ChartTimezone,
  TradeLine,
} from '../../types';
import { ChartBar, ChartMouseClickData } from './types';
import {
  logicalToLogicalRange,
  moveLogicalRange,
  timeToLogical,
  useChartBars,
  useTradeLines,
  useTwChart,
  useTwChartSubscribe,
} from './util';
import { TwOhlcLabel } from './components/TwOhlcLabel';
import { CreateOrderStateAny } from '../ticker-data-container/types';
import { TwCreateOrderStateDisplay } from './components/TwCreateOrderStateDisplay';
import { ensureNever } from '@gmjs/assert';
import { isChartRangeEqual } from '../../util';

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
  const { chartBars } = useChartBars(data, settings.timezone);

  const { chartElementRef, chartApi } = useTwChart(settings, instrument);

  const { currCrosshairItem } = useTwChartSubscribe(
    chartApi,
    onChartClick,
    onChartDoubleClick,
    undefined,
  );

  useEffect(() => {
    if (!chartApi || !navigatePayload) {
      return;
    }

    const currentLogicalRange = chartApi.getTimeRange();

    const newLogicalRangeResult = chartNavigate(
      data,
      settings.timezone,
      currentLogicalRange,
      navigatePayload,
    );

    if (
      newLogicalRangeResult.type === 'change' &&
      !isChartRangeEqual(newLogicalRangeResult.range, currentLogicalRange)
    ) {
      chartApi.setTimeRange(newLogicalRangeResult.range);
    }
  }, [chartApi, data, navigatePayload, settings.timezone]);

  useEffect(() => {
    if (!chartApi) {
      return;
    }

    chartApi.setData(chartBars);
  }, [chartApi, chartBars]);

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

interface NewLogicalRangeResultChange {
  readonly type: 'change';
  readonly range: ChartRange;
}

interface NewLogicalRangeResultNoChange {
  readonly type: 'no-change';
}

type NewLogicalRangeResult =
  | NewLogicalRangeResultChange
  | NewLogicalRangeResultNoChange;

function chartNavigate(
  data: Bars,
  timezone: ChartTimezone,
  currentLogicalRange: ChartRange | undefined,
  payload: ChartNavigatePayloadAny,
): NewLogicalRangeResult {
  const { type } = payload;

  switch (type) {
    case 'start': {
      const newLogicalRange = logicalToLogicalRange(
        0,
        currentLogicalRange,
        data.length,
      );
      return {
        type: 'change',
        range: newLogicalRange,
      };
    }
    case 'end': {
      const newLogicalRange = logicalToLogicalRange(
        data.length - 1,
        currentLogicalRange,
        data.length,
      );
      return {
        type: 'change',
        range: newLogicalRange,
      };
    }
    case 'go-to': {
      const { time } = payload;
      const logical = timeToLogical(time, data);
      const newLogicalRange = logicalToLogicalRange(
        logical,
        currentLogicalRange,
        data.length,
      );
      if (isChartRangeEqual(newLogicalRange, currentLogicalRange)) {
        return {
          type: 'no-change',
        };
      }
      return {
        type: 'change',
        range: newLogicalRange,
      };
    }
    case 'move-by': {
      if (currentLogicalRange === undefined) {
        return {
          type: 'no-change',
        };
      }

      const { timeStep } = payload;

      const newLogicalRange = moveLogicalRange(
        currentLogicalRange,
        timeStep,
        data,
        timezone,
      );
      if (isChartRangeEqual(newLogicalRange, currentLogicalRange)) {
        return {
          type: 'no-change',
        };
      }
      return {
        type: 'change',
        range: newLogicalRange,
      };
    }
    default: {
      return ensureNever(type);
    }
  }
}
