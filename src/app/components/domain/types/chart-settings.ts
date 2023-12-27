import { BarReplayPosition } from './bar-replay-position';
import { ChartRange } from './chart-range';
import { ChartResolution } from './chart-resolution';
import { ChartTimezone } from './chart-timezone';

export interface ChartSettings {
  readonly instrumentName: string;
  readonly resolution: ChartResolution;
  readonly timezone: ChartTimezone;
  readonly logicalRange: ChartRange | undefined;
  readonly replayPosition: BarReplayPosition;
}
