import { UTCTimestamp } from 'lightweight-charts';
import { resolutionToSeconds } from '.';
import { Bar } from '../types';
import { TickerDataResolution } from '@gmjs/gm-trading-shared';

export function createAfterLastBar(
  lastBar: Bar,
  resolution: TickerDataResolution,
): Bar {
  const newTime = lastBar.time + resolutionToSeconds(resolution);
  const newOpen = lastBar.close;

  return {
    time: newTime as UTCTimestamp,
    open: newOpen,
    high: newOpen,
    low: newOpen,
    close: newOpen,
  };
}
