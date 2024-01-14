import { Instrument } from '@gmjs/gm-trading-shared';
import {
  BitmapCoordinatesRenderingScope,
  CanvasRenderingTarget2D,
} from 'fancy-canvas';
import {
  ISeriesPrimitive,
  ISeriesPrimitivePaneRenderer,
  ISeriesPrimitivePaneView,
  SeriesAttachedParameter,
  SeriesPrimitivePaneViewZOrder,
} from 'lightweight-charts';
import { dateObjectTzToWeekday, getHourMinute } from '../../../../util';
import {
  DateObjectTz,
  dateObjectTzAdd,
  dateObjectTzToUnixSeconds,
  unixSecondsToDateObjectTz,
} from '@gmjs/date-util';
import {
  ChartHorizontalScaleItem,
  ChartPrimitiveContext,
  ChartSeriesType,
} from '../types';
import {
  createChartPrimitiveContext,
  getBarWidth,
  getVisibleBarIndexRange,
  getVisibleData,
} from '../shared';
import { ChartBars } from '../../types';

export interface SessionHighlightOptions {
  readonly instrument: Instrument;
  readonly chartTimezone: string;
  readonly color: string;
}

export function createSeriesPrimitiveSessionHighlight(
  options: SessionHighlightOptions,
): ISeriesPrimitive<ChartHorizontalScaleItem> {
  const [primitiveContextInitalize, primitiveContextDestroy, primitiveContext] =
    createChartPrimitiveContext();

  const _paneView: ISeriesPrimitivePaneView =
    createPrimitivePaneViewSessionHighlight(primitiveContext, options);
  const _paneViews: readonly ISeriesPrimitivePaneView[] = [_paneView];

  return {
    updateAllViews: undefined, // (): void;
    priceAxisViews: undefined, // (): readonly ISeriesPrimitiveAxisView[];
    timeAxisViews: undefined, // (): readonly ISeriesPrimitiveAxisView[];
    paneViews: (): readonly ISeriesPrimitivePaneView[] => {
      return _paneViews;
    },
    priceAxisPaneViews: undefined, // (): readonly ISeriesPrimitivePaneView[];
    timeAxisPaneViews: undefined, // (): readonly ISeriesPrimitivePaneView[];
    autoscaleInfo: undefined, // (startTimePoint: Logical, endTimePoint: Logical): AutoscaleInfo | null;
    attached: (
      p: SeriesAttachedParameter<ChartHorizontalScaleItem, ChartSeriesType>,
    ): void => {
      const { chart, series, requestUpdate } = p;
      primitiveContextInitalize(chart, series, requestUpdate);
    },
    detached: (): void => {
      primitiveContextDestroy();
    },
    hitTest: undefined, // (x: number, y: number): PrimitiveHoveredItem | null;
  };
}

function createPrimitivePaneViewSessionHighlight(
  primitiveContext: ChartPrimitiveContext,
  options: SessionHighlightOptions,
): ISeriesPrimitivePaneView {
  const _renderer = createPrimitivePaneRendererSessionHighlight(
    primitiveContext,
    options,
  );

  return {
    renderer: (): ISeriesPrimitivePaneRenderer => {
      return _renderer;
    },
    zOrder: (): SeriesPrimitivePaneViewZOrder => {
      return 'bottom';
    },
  };
}

function createPrimitivePaneRendererSessionHighlight(
  primitiveContext: ChartPrimitiveContext,
  options: SessionHighlightOptions,
): ISeriesPrimitivePaneRenderer {
  return {
    draw: (target: CanvasRenderingTarget2D): void => {
      const range = getVisibleBarIndexRange(primitiveContext.timeScale());
      if (!range) {
        return;
      }

      const visibleData = getVisibleData(primitiveContext.series(), range);

      target.useBitmapCoordinateSpace((scope): void => {
        drawSessionHighlight(scope, primitiveContext, options, visibleData);
      });
    },
    drawBackground: undefined, // (target: CanvasRenderingTarget2D): void;
  };
}

function drawSessionHighlight(
  scope: BitmapCoordinatesRenderingScope,
  primitiveContext: ChartPrimitiveContext,
  options: SessionHighlightOptions,
  visibleData: ChartBars,
): void {
  const { context: ctx, bitmapSize, horizontalPixelRatio } = scope;
  const { width: bitmapWidth, height: bitmapHeight } = bitmapSize;
  const { instrument, color } = options;

  if (visibleData.length === 0) {
    return;
  }

  const timeScale = primitiveContext.timeScale();

  const barWidth = getBarWidth(visibleData, timeScale);
  const halfWidth = (horizontalPixelRatio * barWidth) / 2;

  const sessionRanges = getSessionIndexRanges(visibleData, instrument);

  for (const [i1, i2] of sessionRanges) {
    const p1 = timeScale.timeToCoordinate(visibleData[i1].time);
    const p2 = timeScale.timeToCoordinate(visibleData[i2].time);
    if (p1 === null || p2 === null) {
      continue;
    }

    const x1Scaled = p1 * horizontalPixelRatio;
    const x2Scaled = p2 * horizontalPixelRatio;
    const x1 = Math.max(0, Math.round(x1Scaled - halfWidth));
    const x2 = Math.min(bitmapWidth, Math.round(x2Scaled + halfWidth));
    ctx.fillStyle = color;
    ctx.fillRect(x1, 0, x2 - x1, bitmapHeight);
  }
}

function getSessionIndexRanges(
  bars: ChartBars,
  instrument: Instrument,
): readonly (readonly [number, number])[] {
  const timeRanges = getSessionTimeRanges(bars, instrument);
  if (timeRanges.length === 0) {
    return [];
  }

  const ranges: (readonly [number, number])[] = [];

  let barIndex = 0;
  let rangeIndex = 0;
  let start: number | undefined = undefined;

  while (rangeIndex < timeRanges.length && barIndex < bars.length) {
    const time = bars[barIndex].customValues.realTime;
    const [from, to] = timeRanges[rangeIndex];

    if (time < from) {
      barIndex++;
    } else if (time >= from && time < to) {
      if (start === undefined) {
        start = barIndex;
      }
      barIndex++;
    } else if (time >= to) {
      if (start !== undefined) {
        ranges.push([start, barIndex - 1]);
        start = undefined;
      }
      rangeIndex++;
    }
  }

  if (start !== undefined) {
    ranges.push([start, bars.length - 1]);
    start = undefined;
  }

  return ranges;
}

function getSessionTimeRanges(
  bars: ChartBars,
  instrument: Instrument,
): readonly (readonly [number, number])[] {
  const { timezone: instrumentTimezone, openTime, closeTime } = instrument;
  const [openHour, openMinute] = getHourMinute(openTime);
  const [closeHour, closeMinute] = getHourMinute(closeTime);

  const firstTime = bars[0].time;
  const lastTime = bars.at(-1)!.time;

  const sessionRanges: (readonly [number, number])[] = [];

  let instrumentDay: DateObjectTz = {
    ...unixSecondsToDateObjectTz(firstTime, instrumentTimezone),
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
  };
  let weekday = dateObjectTzToWeekday(instrumentDay);
  while (dateObjectTzToUnixSeconds(instrumentDay) <= lastTime) {
    if (weekday <= 5) {
      const sessionRange = getSessionRangeForDay(
        instrumentDay,
        openHour,
        openMinute,
        closeHour,
        closeMinute,
      );
      sessionRanges.push(sessionRange);
    }
    const dayIncrement = weekday >= 5 ? 8 - weekday : 1;
    instrumentDay = dateObjectTzAdd(instrumentDay, { days: dayIncrement });
    weekday = ((weekday + dayIncrement - 1) % 7) + 1;
  }

  return sessionRanges;
}

function getSessionRangeForDay(
  instrumentDay: DateObjectTz,
  openHour: number,
  openMinute: number,
  closeHour: number,
  closeMinute: number,
): readonly [number, number] {
  const from = dateObjectTzToUnixSeconds({
    ...instrumentDay,
    hour: openHour,
    minute: openMinute,
    second: 0,
    millisecond: 0,
  });

  const to = dateObjectTzToUnixSeconds({
    ...instrumentDay,
    hour: closeHour,
    minute: closeMinute,
    second: 0,
    millisecond: 0,
  });

  return [from, to];
}
