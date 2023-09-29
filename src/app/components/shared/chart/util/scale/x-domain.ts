import { invariant } from '@gmjs/assert';
import { TickerDataResolution, TickerDataRow } from '../../../../../types';
import { tickerDataResolutionToSeconds } from '../data';

export function toXDomain(
  data: readonly TickerDataRow[],
  interval: TickerDataResolution,
): readonly number[] {
  const tsList = data.map((data) => data.ts);
  const extendedTsList = extendTimestampListByOne(tsList, interval);
  return extendedTsList;
}

function extendTimestampListByOne(
  tsList: readonly number[],
  interval: TickerDataResolution,
): readonly number[] {
  if (tsList.length === 0) {
    return [];
  }

  const lastTs = tsList.at(-1) ?? 0;
  const nextTs = lastTs + tickerDataResolutionToSeconds(interval);

  return [...tsList, nextTs];
}


