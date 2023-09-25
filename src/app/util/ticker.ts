import { invariant } from '@gmjs/assert';
import { TickerDataResolution } from '../types';

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
