import { invariant } from '@gmjs/assert';
import { TickerDataResolution, TickerDataRow } from '../../../../../types';

export function toXDomain(
  data: readonly TickerDataRow[],
  interval: TickerDataResolution,
): readonly string[] {
  const tsList = data.map((data) => data.ts);
  const extendedTsList = extendTimestampListByOne(tsList, interval);
  return extendedTsList.map((ts) => ts.toString());
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

function tickerDataResolutionToSeconds(
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
