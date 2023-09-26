import { DateTime } from 'luxon';
import { TickerDataRow } from '../../../../../../types';

const TICKER_GRID_OPACITY_STEP = 0.1;

export function getXGridStrokeOpacity(
  data: readonly TickerDataRow[],
  index: number,
  getXGridMultiplier: (ts1: number, ts2: number) => number,
): number {
  if (index <= 0 || index >= data.length) {
    return TICKER_GRID_OPACITY_STEP;
  }

  const ts1 = data[index - 1]?.ts ?? 0;
  const ts2 = data[index]?.ts ?? 0;

  return TICKER_GRID_OPACITY_STEP * getXGridMultiplier(ts1, ts2);
}

export type CandlestickTimeUnit = 'year' | 'month' | 'week' | 'day' | 'hour';

export function getTimeUnitDifferencesBetweenTimestamps(
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
