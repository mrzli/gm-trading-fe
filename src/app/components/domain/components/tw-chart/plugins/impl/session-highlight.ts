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
import { Bar, Bars } from '../../../../types';
import { tzToUtcTimestampForBars } from '../../util';
import { dateObjectTzToWeekday, getHourMinute } from '../../../../util';
import { unixSecondsToDateObjectTz } from '@gmjs/date-util';

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

  const sessionRanges = getSessionRanges(timeCorrectedData, instrument);

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

function getSessionRanges(
  timeCorrectedData: Bars,
  instrument: Instrument,
): readonly (readonly [number, number])[] {
  const { timezone: instrumentTimezone, openTime, closeTime } = instrument;
  const [openHour, openMinute] = getHourMinute(openTime);
  const [closeHour, closeMinute] = getHourMinute(closeTime);
  const openMinuteOfDay = openHour * 60 + openMinute;
  const closeMinuteOfDay = closeHour * 60 + closeMinute;

  const sessionBars = timeCorrectedData.map((bar) =>
    isInSession(bar, instrumentTimezone, openMinuteOfDay, closeMinuteOfDay),
  );

  let start: number | undefined = undefined;
  const ranges: (readonly [number, number])[] = [];

  for (const [i, isInSession] of sessionBars.entries()) {
    if (isInSession && start === undefined) {
      start = i; // start of a new range
    } else if (!isInSession && start !== undefined) {
      ranges.push([start, i - 1]);
      start = undefined; // end of the current range
    }
  }

  // if last element is part of range
  if (start !== undefined) {
    ranges.push([start, sessionBars.length - 1]);
  }

  return ranges;
}

function isInSession(
  bar: Bar,
  instrumentTimezone: string,
  openMinuteOfDay: number,
  closeMinuteOfDay: number,
): boolean {
  const time = bar.time as number;
  const dateObject = unixSecondsToDateObjectTz(time, instrumentTimezone);
  const weekday = dateObjectTzToWeekday(dateObject);
  if (weekday > 5) {
    return false;
  }

  const { hour, minute } = dateObject;

  const minuteOfDay = hour * 60 + minute;

  return minuteOfDay >= openMinuteOfDay && minuteOfDay < closeMinuteOfDay;
}
