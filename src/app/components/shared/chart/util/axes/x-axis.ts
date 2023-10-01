import * as d3 from 'd3';
import { CandlestickChartXScale } from '../scale';
import { TickerDataResolution, TickerDataRow } from '../../../../../types';
import {
  getTimeUnitDifferencesBetweenTimestamps,
  tickerDataResolutionToSeconds,
} from '../data';
import {
  timestampToDay,
  timestampToMonth,
  timestampToTime,
  timestampToYear,
} from './format';

export function getXAxis(
  xScale: CandlestickChartXScale,
  resolution: TickerDataResolution,
  rows: readonly TickerDataRow[],
): d3.Axis<number> {
  const timestamps = xScale.domain();
  const firstTs = timestamps[0] ?? 0;
  const extendedTimestamps: readonly number[] = [
    firstTs - tickerDataResolutionToSeconds(resolution),
    ...timestamps,
  ];

  return d3
    .axisBottom(xScale)
    .tickFormat((_v: number, i: number) => format(i, extendedTimestamps));
}

function format(index: number, extendedTimestamps: readonly number[]): string {
  const timezone = 'UTC';

  const prevTs = extendedTimestamps[index] ?? 0; // in extendedTimestamps
  const currTs = extendedTimestamps[index + 1] ?? 0; // in extendedTimestamps

  const steps = getTimeUnitDifferencesBetweenTimestamps(
    prevTs,
    currTs,
    timezone,
  );

  if (steps.has('year')) {
    return timestampToYear(currTs, timezone);
  } else if (steps.has('month')) {
    return timestampToMonth(currTs, timezone);
  } else if (steps.has('day')) {
    return timestampToDay(currTs, timezone);
  } else {
    return timestampToTime(currTs, timezone);
  }
}
