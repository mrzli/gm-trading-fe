/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useCallback, useEffect, useState } from 'react';
import { Instrument } from '@gmjs/gm-trading-shared';
import {
  Bars,
  ChartNavigatePayloadAny,
  ChartRange,
  ChartSettings,
  ChartTimezone,
  TradeLine,
} from '../../types';
import { ChartBar, ChartBars, ChartMouseClickData } from './types';
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
import { isChartRangeEqual } from '../../util';
import { CreateOrderStateAny } from '../ticker-data-container/types';
import { TwCreateOrderStateDisplay } from './components/TwCreateOrderStateDisplay';
import { ensureNever } from '@gmjs/assert';

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
  const chartBars = useChartBars(data, settings.timezone);

  const [visibleBarsOffset, setVisibleBarsOffset] = useState<number>(0);

  const { chartElementRef, chartApi } = useTwChart(settings, instrument);

  const handleLogicalRangeChange = useCallback(
    (logicalRange: ChartRange | undefined) => {
    },
    [],
  );

  useEffect(
    () => {
      if (!navigatePayload || !chartApi) {
        return;
      }

      const currentLogicalRange = chartApi.getTimeRange();
      const newLogicalRangeResult = getNewLogicalRange(
        chartBars,
        settings.timezone,
        currentLogicalRange,
        navigatePayload,
      );
      
      const { type } = newLogicalRangeResult;
      if (type === 'change') {
        const { range } = newLogicalRangeResult;
        chartApi.setTimeRange(range);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [navigatePayload],
  );

  const { currCrosshairItem } = useTwChartSubscribe(
    chartApi,
    onChartClick,
    onChartDoubleClick,
    handleLogicalRangeChange,
  );

  useEffect(
    () => {
      if (!chartApi) {
        return;
      }

      // const newOffset = getNewVisibleBarsOffset(
      //   chartBars,
      //   logicalRange,
      //   visibleBarsOffset,
      // );

      // if (newOffset === visibleBarsOffset) {
      //   return;
      // }

      // const visibleChartBars = chartBars.slice(
      //   newOffset,
      //   newOffset + VISIBLE_BARS_RANGE,
      // );

      // setVisibleBarsOffset(newOffset);
      chartApi.setData(chartBars);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [chartBars, chartApi /*, visibleBarsOffset*/],
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

function getNewLogicalRange(
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

function getNewVisibleBarsOffset(
  chartBars: ChartBars,
  logicalRange: ChartRange | undefined,
  visibleBarsOffset: number,
): number {
  const from =
    logicalRange === undefined
      ? chartBars.length - 1
      : Math.max(0, Math.floor(logicalRange.from));

  const leftMargin = Math.max(0, from - VISIBLE_BARS_WINDOW_MARGIN);
  const rightMargin = from + VISIBLE_BARS_WINDOW_MARGIN;

  if (
    visibleBarsOffset > leftMargin ||
    visibleBarsOffset + VISIBLE_BARS_RANGE < rightMargin
  ) {
    const newOffset = Math.max(0, from - VISIBLE_BARS_HALF_RANGE);
    return newOffset;
  } else {
    return visibleBarsOffset;
  }
}

const VISIBLE_BARS_HALF_RANGE = 20_000;
const VISIBLE_BARS_RANGE = VISIBLE_BARS_HALF_RANGE * 2;
const VISIBLE_BARS_WINDOW_MARGIN = 5000;
