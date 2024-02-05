import { Bar, TickerDataResolution } from '@gmjs/gm-trading-shared';
import { resolutionToSeconds } from './resolution';

export function createAfterLastBar(
  lastBar: Bar,
  resolution: TickerDataResolution,
): Bar {
  const newTime = lastBar.time + resolutionToSeconds(resolution);
  const newOpen = lastBar.close;

  return {
    time: newTime,
    open: newOpen,
    high: newOpen,
    low: newOpen,
    close: newOpen,
  };
}
