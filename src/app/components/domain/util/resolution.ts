import { invariant } from '@gmjs/assert';
import { parseIntegerOrThrow } from '@gmjs/number-util';
import {
  MINUTE_TO_SECONDS,
  HOUR_TO_SECONDS,
  DAY_TO_SECONDS,
  WEEK_TO_SECONDS,
} from '../../../util';
import { ChartResolution } from '../types';

export function resolutionToSeconds(resolution: ChartResolution): number {
  const unit = resolution.slice(-1);

  switch (unit) {
    case 'm': {
      const value = parseIntegerOrThrow(resolution.slice(0, -1));
      return value * MINUTE_TO_SECONDS;
    }
    case 'h': {
      const value = parseIntegerOrThrow(resolution.slice(0, -1));
      return value * HOUR_TO_SECONDS;
    }
    case 'D': {
      return DAY_TO_SECONDS;
    }
    case 'W': {
      return WEEK_TO_SECONDS;
    }
    default: {
      invariant(false, `Unexpected unit: ${unit}`);
    }
  }
}
