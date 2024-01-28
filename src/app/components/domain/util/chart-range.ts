import { ChartRange } from '../types';

export function isChartRangeEqual(
  a: ChartRange | undefined,
  b: ChartRange | undefined,
): boolean {
  if (a === undefined || b === undefined) {
    return a === b;
  }

  return equalEpsilon(a.from, b.from) && equalEpsilon(a.to, b.to);
}

const EPSILON = 0.001;

function equalEpsilon(a: number, b: number): boolean {
  return Math.abs(a - b) < EPSILON;
}

export function offsetChartRange(
  range: ChartRange,
  offset: number,
): ChartRange {
  return {
    from: range.from + offset,
    to: range.to + offset,
  };
}
