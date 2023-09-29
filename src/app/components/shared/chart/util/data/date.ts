import { DateTime } from 'luxon';
import { TickerDataResolution } from '../../../../../types';
import { invariant } from '@gmjs/assert';

export type CandlestickTimeUnit = 'year' | 'month' | 'week' | 'day' | 'hour';

export function getTimeUnitDifferencesBetweenTimestamps(
  ts1: number,
  ts2: number,
  timezone: string,
): ReadonlySet<CandlestickTimeUnit> {
  const dt1 = DateTime.fromSeconds(ts1, { zone: timezone });
  const dt2 = DateTime.fromSeconds(ts2, { zone: timezone });

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

export function tickerDataResolutionToSeconds(
  resolution: TickerDataResolution,
): number {
  switch (resolution) {
    case 'day': {
      return 24 * 60 * 60;
    }
    case 'quarter': {
      return 15 * 60;
    }
    case 'minute': {
      return 60;
    }
    default: {
      invariant(false, `Invalid ticker data resolution: '${resolution}'.`);
    }
  }
}
