import { invariant } from '@gmjs/assert';
import { TickerDataRow } from '../../../../../../../app/types';
import { CandlestickChartD3GSelectionFn } from '../../../types';
import { CandlestickChartXScale } from '../../scale';
import { getTickX } from '../../position';
import { getTimeUnitDifferencesBetweenTimestamps } from '../../data';
import { TickerDataResolution } from '@gmjs/gm-trading-shared';

export function getXGrid(
  xScale: CandlestickChartXScale,
  resolution: TickerDataResolution,
  rows: readonly TickerDataRow[],
  chartHeight: number,
): CandlestickChartD3GSelectionFn {
  const ticks = xScale.domain().map((d) => getTickX(d, xScale));

  return getXGridFromTicks(ticks, chartHeight);
}

type OpacityFn = (
  ts1: number,
  ts2: number,
  resolution: TickerDataResolution,
) => number;

function getXGridFromTicks(
  ticks: readonly number[],
  chartHeight: number,
): CandlestickChartD3GSelectionFn {
  return (g) =>
    g
      .selectAll('line')
      .data(ticks)
      .join('line')
      .attr('x1', (d) => d ?? 0)
      .attr('y1', 0)
      .attr('x2', (d) => d ?? 0)
      .attr('y2', chartHeight)
      .attr('stroke', 'black')
      .attr(
        'stroke-opacity',
        (_d, i) =>
          // +1 bacause there is no grid line for first item on chart
          // (there is a tick, but grid line is essentially on y-axis)
          // see .slice(1) above
          0.1, // getXGridStrokeOpacity(rows, i + 1, getXGridMultiplier(resolution)),
      )
      .attr('stroke-width', 1);
}

function getXGridMultiplier(
  resolution: TickerDataResolution,
): (ts1: number, ts2: number) => number {
  return (ts1: number, ts2: number) => {
    const steps = getTimeUnitDifferencesBetweenTimestamps(ts1, ts2, 'UTC');

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
  };
}

function getXTickStridesByResolution(
  resolution: TickerDataResolution,
): readonly number[] {
  switch (resolution) {
    case 'day': {
      return [1, 7, 30, 365];
    }
    case 'quarter': {
      return [1, 4, 12];
    }
    case 'minute': {
      return [1, 60, 1440];
    }
    default: {
      invariant(false, `Invalid ticker data resolution: '${resolution}'.`);
    }
  }
}
