import { TwChartTimezone } from './tw-chart-timezone';
import { TwChartResolution } from './tw-chart-resolution';
import { TwRange } from './tw-init-input';
import { BarReplayPosition } from '../../types';

export interface TwChartSettings {
  readonly instrumentName: string;
  readonly resolution: TwChartResolution;
  readonly timezone: TwChartTimezone;
  readonly logicalRange: TwRange | undefined;
  readonly replayPosition: BarReplayPosition;
}
