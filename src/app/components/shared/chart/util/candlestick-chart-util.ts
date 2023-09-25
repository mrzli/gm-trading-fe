import * as d3 from 'd3';
import { DateTime } from 'luxon';
import { applyFn } from '@gmjs/apply-function';
import { compose } from '@gmjs/compose-function';
import { concat, map, toArray } from '@gmjs/value-transformers';
import { parseIntegerOrThrow } from '@gmjs/number-util';
import { invariant } from '@gmjs/assert';
import {
  TickerDataRow,
  NumericRange,
  TickerDataResolution,
} from '../../../../types';
import {
  CandlestickChartMargin,
  CandlestickChartScales,
  CandlestickChartXScale,
  CandlestickChartYScale,
  CandlestickChartDataItem,
  CandlestickChartD3GSelectionFn,
} from '../types';
import {
  tickerDataResolutionToSeconds,
  timestampToIsoDatetime,
} from '../../../../util';

export const CANDLESTICK_CHART_MARGIN: CandlestickChartMargin = {
  top: 20,
  right: 80,
  bottom: 100,
  left: 60,
};

export function getCandlestickChartScales(
  data: readonly TickerDataRow[],
  interval: TickerDataResolution,
  valueRange: NumericRange,
  width: number,
  height: number,
): CandlestickChartScales {
  return {
    xScale: getXScale(data, interval, width),
    yScale: getYScale(valueRange, height),
  };
}

const PADDING_INNER = 0.5;
const PADDING_OUTER = -(1 - PADDING_INNER) / 2;
const ALIGN = 0.5;

function getXScale(
  data: readonly TickerDataRow[],
  interval: TickerDataResolution,
  width: number,
): CandlestickChartXScale {
  const additionalXEntries: readonly number[] =
    data.length > 0
      ? [(data.at(-1)?.ts ?? 0) + tickerDataResolutionToSeconds(interval)]
      : [];
  const domain = applyFn(
    data,
    compose(
      map((item) => item.ts),
      concat(additionalXEntries),
      map((ts) => ts.toString()),
      toArray(),
    ),
  );

  return d3
    .scaleBand()
    .domain(domain)
    .range([
      CANDLESTICK_CHART_MARGIN.left,
      width - CANDLESTICK_CHART_MARGIN.right,
    ])
    .paddingInner(PADDING_INNER)
    .paddingOuter(PADDING_OUTER)
    .align(ALIGN);
}

function getYScale(
  valueRange: NumericRange,
  height: number,
): CandlestickChartYScale {
  return d3
    .scaleLinear()
    .domain([valueRange.start, valueRange.end])
    .range([
      height - CANDLESTICK_CHART_MARGIN.bottom,
      CANDLESTICK_CHART_MARGIN.top,
    ]);
}

export function toCandlestickChartDataItem(
  item: TickerDataRow,
  xScale: CandlestickChartXScale,
  yScale: CandlestickChartYScale,
): CandlestickChartDataItem {
  return {
    x: getXCoordinateShape(item.ts.toString(), xScale),
    w: xScale.bandwidth(),
    o: yScale(item.o),
    h: yScale(item.h),
    l: yScale(item.l),
    c: yScale(item.c),
    tooltip: {
      ts: item.ts,
      o: item.o,
      h: item.h,
      l: item.l,
      c: item.c,
    },
  };
}

export function getCandlestickChartXAxis(
  xScale: CandlestickChartXScale,
): d3.Axis<string> {
  return d3.axisBottom(xScale).tickFormat(dateFormat);
}

export function getCandlestickChartXGrid(
  xScale: CandlestickChartXScale,
  resolution: TickerDataResolution,
  rows: readonly TickerDataRow[],
  height: number,
): CandlestickChartD3GSelectionFn {
  const ticks = xScale
    .domain()
    .slice(1)
    .map((d) => getXCoordinateTick(d, xScale));

  return (g) =>
    g
      .selectAll('line')
      .data(ticks)
      .join('line')
      .attr('x1', (d) => d ?? 0)
      .attr('y1', 0)
      .attr('x2', (d) => d ?? 0)
      .attr(
        'y2',
        height - CANDLESTICK_CHART_MARGIN.top - CANDLESTICK_CHART_MARGIN.bottom,
      )
      .attr('stroke', 'black')
      .attr('stroke-opacity', (_d, i) =>
        // +1 bacause there is no grid line for first item on chart
        // (there is a tick, but grid line is essentially on y-axis)
        // see .slice(1) above
        getXGridStrokeOpacity(resolution, rows, i + 1),
      )
      .attr('stroke-width', 1);
}

export function getCandlestickChartYAxis(
  yScale: CandlestickChartYScale,
  precision: number,
): d3.Axis<d3.NumberValue> {
  return d3
    .axisLeft(yScale)
    .tickFormat((value) => value.valueOf().toFixed(precision));
}

export function getCandlestickChartYGrid(
  yScale: CandlestickChartYScale,
  width: number,
): CandlestickChartD3GSelectionFn {
  return (g) =>
    g
      .selectAll('line')
      .data(yScale.ticks())
      .join('line')
      .attr('x1', 0)
      .attr('y1', (d) => yScale(d))
      .attr(
        'x2',
        width - CANDLESTICK_CHART_MARGIN.left - CANDLESTICK_CHART_MARGIN.right,
      )
      .attr('y2', (d) => yScale(d))
      .attr('stroke', 'black')
      .attr('stroke-opacity', 0.1);
}

function getXCoordinateShape(
  tsStr: string,
  xScale: CandlestickChartXScale,
): number {
  // adjust shape to go exactly between ticks (half after tick), instead of being on the tick
  const adjustHalfTick = xScale.step() / 2;

  return getXCoordinateTick(tsStr, xScale) + adjustHalfTick;
}

function getXCoordinateTick(
  tsStr: string,
  xScale: CandlestickChartXScale,
): number {
  const xBase = xScale(tsStr) ?? 0;
  // adjust for the fact that referent 'x' is the middle of the rect for my svg shape
  // and d3 seems to expect the referent 'x' to be on the left side of the shape
  const adjustReferentX = (xScale.step() * (1 - xScale.paddingInner())) / 2;

  return xBase + adjustReferentX;
}

function dateFormat(tsStr: string, _index: number): string {
  return timestampToIsoDatetime(parseIntegerOrThrow(tsStr));
}

type CandlestickTimeUnit = 'year' | 'month' | 'week' | 'day' | 'hour';

const TICKER_GRID_OPACITY_STEP = 0.1;

function getXGridStrokeOpacity(
  resolution: TickerDataResolution,
  data: readonly TickerDataRow[],
  index: number,
): number {
  if (index <= 0 || index >= data.length) {
    return TICKER_GRID_OPACITY_STEP;
  }

  const ts1 = data[index - 1]?.ts ?? 0;
  const ts2 = data[index]?.ts ?? 0;

  return TICKER_GRID_OPACITY_STEP * getXGridMultiplier(ts1, ts2, resolution);
}

function getXGridMultiplier(
  ts1: number,
  ts2: number,
  resolution: TickerDataResolution,
): number {
  const steps = getTimeUnitSteps(ts1, ts2);

  const MULTIPLIER_3 = 8;
  const MULTIPLIER_2 = 4;

  switch (resolution) {
    case 'day': {
      return steps.has('year')
        ? MULTIPLIER_3
        : steps.has('week')
        ? MULTIPLIER_2
        : 1;
    }
    case 'quarter': {
      return steps.has('week')
        ? MULTIPLIER_3
        : steps.has('day')
        ? MULTIPLIER_2
        : 1;
    }
    case 'minute': {
      return steps.has('day')
        ? MULTIPLIER_3
        : steps.has('hour')
        ? MULTIPLIER_2
        : 1;
    }
    default: {
      invariant(false, `Invalid ticker data resolution: '${resolution}'.`);
    }
  }
}

function getTimeUnitSteps(
  ts1: number,
  ts2: number,
): ReadonlySet<CandlestickTimeUnit> {
  const dt1 = DateTime.fromSeconds(ts1, { zone: 'UTC' });
  const dt2 = DateTime.fromSeconds(ts2, { zone: 'UTC' });

  const steps = new Set<CandlestickTimeUnit>();

  if (dt2.year !== dt1.year) {
    steps.add('year');
  }
  if (dt2.month !== dt1.month) {
    steps.add('month');
  }
  if (dt2.weekNumber !== dt1.weekNumber) {
    steps.add('week');
  }
  if (dt2.day !== dt1.day) {
    steps.add('day');
  }
  if (dt2.hour !== dt1.hour) {
    steps.add('hour');
  }

  return steps;
}
