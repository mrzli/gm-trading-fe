import { ChartTimezone } from './chart-timezone';
import { ChartResolution } from './chart-resolution';
import { TwRange } from '../components/tw-chart/types/tw-init-input';
import { BarReplayPosition } from './bar-replay-position';

export interface ChartSettings {
  readonly instrumentName: string;
  readonly resolution: ChartResolution;
  readonly timezone: ChartTimezone;
  readonly logicalRange: TwRange | undefined;
  readonly replayPosition: BarReplayPosition;
}
