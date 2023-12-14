import { TwChartTimezone } from '.';
import { TwChartResolution } from './tw-chart-resolution';
import { TwRange } from './tw-init-input';

export interface TwChartSettings {
  readonly instrumentName: string;
  readonly resolution: TwChartResolution;
  readonly timezone: TwChartTimezone;
  readonly logicalRange: TwRange | undefined;
  readonly replaySettings: TwBarReplaySettings;
}

export interface TwBarReplaySettings {
  readonly barIndex: number | undefined;
  readonly subBarIndex: number;
}
