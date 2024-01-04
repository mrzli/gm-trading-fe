import { UTCTimestamp } from 'lightweight-charts';
import { resolutionToSeconds } from '.';
import { Bar, ChartResolution } from '../types';

export function createAfterLastBar(
  lastBar: Bar,
  resolution: ChartResolution,
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
