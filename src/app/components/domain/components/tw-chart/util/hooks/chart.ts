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
import {
  Bars,
  ChartNavigatePayloadAny,
  ChartRange,
  ChartSettings,
  ChartTimezone,
  TradeLine,
} from '../../../../types';
import { Instrument } from '@gmjs/gm-trading-shared';
import { getChartBars } from '../chart-bars';
import {
  logicalToLogicalRange,
  moveLogicalRange,
  timeToLogical,
} from '../navigate-chart';
import { isChartRangeEqual } from '../../../../util';
import { ensureNever } from '@gmjs/assert';

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
  };
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

export interface UseChartBarsResult {
  readonly chartBars: ChartBars;
  readonly visibleChartBars: ChartBars;
  readonly relativeRange: ChartRange | undefined;
  readonly handleRelativeRangeChange: (range: ChartRange | undefined) => void;
}

const VISIBLE_BARS_HALF_RANGE = 20_000;
const VISIBLE_BARS_RANGE = VISIBLE_BARS_HALF_RANGE * 2;
const VISIBLE_BARS_WINDOW_MARGIN = 5000;

export function useChartBars(
  data: Bars,
  timezone: ChartTimezone,
  navigatePayload: ChartNavigatePayloadAny | undefined,
): UseChartBarsResult {
  const chartBars = useMemo<ChartBars>(() => {
    return getChartBars(data, timezone);
  }, [data, timezone]);

  const [absoluteRange, setAbsoluteRange] = useState<ChartRange | undefined>(
    undefined,
  );

  const [visibleChartBarsOffset, setVisibleChartBarsOffset] = useState<number>(
    Math.max(0, chartBars.length - VISIBLE_BARS_HALF_RANGE),
  );

  const relativeRange = useMemo<ChartRange | undefined>(() => {
    return absoluteRange === undefined
      ? undefined
      : offsetChartRange(absoluteRange, -visibleChartBarsOffset);
  }, [absoluteRange, visibleChartBarsOffset]);

  const visibleChartBars = useMemo(() => {
    return chartBars.slice(
      visibleChartBarsOffset,
      visibleChartBarsOffset + VISIBLE_BARS_RANGE,
    );
  }, [chartBars, visibleChartBarsOffset]);

  const updateAbsoluteRange = useCallback(
    (range: ChartRange | undefined) => {
      const newOffset = getNewVisibleBarsOffset(
        chartBars,
        range,
        visibleChartBarsOffset,
      );

      setVisibleChartBarsOffset(newOffset);
      setAbsoluteRange(range);
    },
    [chartBars, visibleChartBarsOffset],
  );

  const handleRelativeRangeChange = useCallback(
    (relativeRange: ChartRange | undefined) => {
      const absoluteRange = relativeRangeToAbsoluteRange(
        relativeRange,
        visibleChartBarsOffset,
      );
      updateAbsoluteRange(absoluteRange);
    },
    [updateAbsoluteRange, visibleChartBarsOffset],
  );

  const handleChartNavigate = useCallback(
    (payload: ChartNavigatePayloadAny) => {
      const navigateResult = chartNavigate(
        data,
        timezone,
        absoluteRange,
        payload,
      );
      if (navigateResult.type === 'change') {
        updateAbsoluteRange(navigateResult.range);
      }
    },
    [absoluteRange, data, timezone, updateAbsoluteRange],
  );

  useEffect(
    () => {
      if (navigatePayload) {
        handleChartNavigate(navigatePayload);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [navigatePayload],
  );

  return {
    chartBars,
    visibleChartBars,
    relativeRange,
    handleRelativeRangeChange,
  };
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

function relativeRangeToAbsoluteRange(
  relativeRange: ChartRange | undefined,
  visibleChartBarsOffset: number,
): ChartRange | undefined {
  if (!relativeRange) {
    return undefined;
  }

  return offsetChartRange(relativeRange, visibleChartBarsOffset);
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

function offsetChartRange(chartRange: ChartRange, offset: number): ChartRange {
  return {
    from: chartRange.from + offset,
    to: chartRange.to + offset,
  };
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
