import { ensureNotUndefined } from '@gmjs/assert';
import { Instrument } from '@gmjs/gm-trading-shared';
import {
  BitmapCoordinatesRenderingScope,
  CanvasRenderingTarget2D,
} from 'fancy-canvas';
import {
  IChartApi,
  ISeriesApi,
  ISeriesPrimitive,
  ISeriesPrimitivePaneRenderer,
  ISeriesPrimitivePaneView,
  ITimeScaleApi,
  SeriesAttachedParameter,
  SeriesPrimitivePaneViewZOrder,
  Time,
} from 'lightweight-charts';
import { Bars } from '../../../../types';
import { tzToUtcTimestampForBars } from '../../util';
import { dateObjectTzToWeekday, getHourMinute } from '../../../../util';
import {
  DateObjectTz,
  dateObjectTzAdd,
  dateObjectTzToUnixSeconds,
  unixSecondsToDateObjectTz,
} from '@gmjs/date-util';

export interface SessionHighlightOptions {
  readonly instrument: Instrument;
  readonly chartTimezone: string;
  readonly color: string;
}

type HorizontalScaleItem = Time;
type SeriesType = 'Candlestick';

// type RequestUpdate = () => void;

interface SessionHighlightPrimitiveContext {
  readonly chart: () => IChartApi;
  readonly series: () => ISeriesApi<SeriesType>;
  readonly timeScale: () => ITimeScaleApi<HorizontalScaleItem>;
}

export function createSessionHighlightSeriesPrimitive(
  options: SessionHighlightOptions,
): ISeriesPrimitive<HorizontalScaleItem> {
  let _chart: IChartApi | undefined = undefined;
  let _series: ISeriesApi<SeriesType> | undefined = undefined;
  // let _requestUpdate: RequestUpdate | undefined = undefined;

  function chart(): IChartApi {
    return ensureNotUndefined(_chart);
  }

  function series(): ISeriesApi<SeriesType> {
    return ensureNotUndefined(_series);
  }

  function timeScale(): ITimeScaleApi<HorizontalScaleItem> {
    return chart().timeScale();
  }

  const primitiveContext: SessionHighlightPrimitiveContext = {
    chart,
    series,
    timeScale,
  };

  const _paneView: ISeriesPrimitivePaneView =
    createSessionHighlightPrimitivePaneView(primitiveContext, options);
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
      p: SeriesAttachedParameter<HorizontalScaleItem, SeriesType>,
    ): void => {
      const { chart: c, series: s } = p;
      _chart = c;
      _series = s;
      // _requestUpdate = ru;
    },
    detached: (): void => {
      // _requestUpdate = undefined;
      _series = undefined;
      _chart = undefined;
    },
    hitTest: undefined, // (x: number, y: number): PrimitiveHoveredItem | null;
  };
}

function createSessionHighlightPrimitivePaneView(
  primitiveContext: SessionHighlightPrimitiveContext,
  options: SessionHighlightOptions,
): ISeriesPrimitivePaneView {
  const _renderer = createSessionHighlightPrimitivePaneRenderer(
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

function createSessionHighlightPrimitivePaneRenderer(
  primitiveContext: SessionHighlightPrimitiveContext,
  options: SessionHighlightOptions,
): ISeriesPrimitivePaneRenderer {
  return {
    draw: (target: CanvasRenderingTarget2D): void => {
      const timeScale = primitiveContext.timeScale();

      const logicalRange = timeScale.getVisibleLogicalRange() ?? undefined;
      if (!logicalRange) {
        return;
      }

      const fromIndex = Math.max(0, Math.floor(logicalRange.from));
      const toIndex = Math.max(0, Math.ceil(logicalRange.to));

      const series = primitiveContext.series();
      const visibleData: Bars = series
        .data()
        .slice(fromIndex, toIndex + 1) as Bars;

      target.useBitmapCoordinateSpace((scope): void => {
        drawSessionHighlight(scope, primitiveContext, options, visibleData);
      });
    },
    drawBackground: undefined, // (target: CanvasRenderingTarget2D): void;
  };
}

function drawSessionHighlight(
  scope: BitmapCoordinatesRenderingScope,
  primitiveContext: SessionHighlightPrimitiveContext,
  options: SessionHighlightOptions,
  visibleData: Bars,
): void {
  const { context: ctx, bitmapSize, horizontalPixelRatio } = scope;
  const { width, height } = bitmapSize;
  const { instrument, chartTimezone, color } = options;

  if (visibleData.length === 0) {
    return;
  }

  const timeScale = primitiveContext.timeScale();

  const barWidth = getBarWidth(visibleData, timeScale);
  const halfWidth = (horizontalPixelRatio * barWidth) / 2;

  // unadjust time to correct for previous adjustment
  //   previous adjustment is done to visually have corrent timezone data in chart
  const timeCorrectedData = tzToUtcTimestampForBars(visibleData, chartTimezone);

  const sessionRanges = getSessionIndexRanges(timeCorrectedData, instrument);

  for (const [i1, i2] of sessionRanges) {
    const p1 = timeScale.timeToCoordinate(visibleData[i1].time);
    const p2 = timeScale.timeToCoordinate(visibleData[i2].time);
    if (p1 === null || p2 === null) {
      continue;
    }

    const x1Scaled = p1 * horizontalPixelRatio;
    const x2Scaled = p2 * horizontalPixelRatio;
    const x1 = Math.max(0, Math.round(x1Scaled - halfWidth));
    const x2 = Math.min(width, Math.round(x2Scaled + halfWidth));
    ctx.fillStyle = color;
    ctx.fillRect(x1, 0, x2 - x1, height);
  }
}

const DEFAULT_BAR_WIDTH = 6;

function getBarWidth(
  visibleData: Bars,
  timeScale: ITimeScaleApi<HorizontalScaleItem>,
): number {
  if (visibleData.length < 2) {
    return DEFAULT_BAR_WIDTH;
  }

  const firstBarX = timeScale.timeToCoordinate(visibleData[0].time);
  const secondBarX = timeScale.timeToCoordinate(visibleData[1].time);
  if (firstBarX === null || secondBarX === null) {
    return DEFAULT_BAR_WIDTH;
  }

  return secondBarX - firstBarX;
}

function getSessionIndexRanges(
  bars: Bars,
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
    const time = bars[barIndex].time as number;
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
  bars: Bars,
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
