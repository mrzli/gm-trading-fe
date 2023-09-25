import { DateTime } from 'luxon';
import { invariant } from '@gmjs/assert';
import { CANDLESTICK_CHART_MARGIN } from '../margin';
import { TickerDataResolution, TickerDataRow } from '../../../../../types';
import { CandlestickChartD3GSelectionFn } from '../../types';
import { CandlestickChartXScale } from '../scale';
import { getTickX } from '../position';

export function getXGrid(
  xScale: CandlestickChartXScale,
  resolution: TickerDataResolution,
  rows: readonly TickerDataRow[],
  height: number,
): CandlestickChartD3GSelectionFn {
  const ticks = xScale
    .domain()
    .slice(1)
    .map((d) => getTickX(d, xScale));

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

type CandlestickTimeUnit = 'year' | 'month' | 'week' | 'day' | 'hour';

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
