import { TwChartResolution } from './tw-chart-resolution';
import { TwRange } from './tw-init-input';

export interface TwChartSettings {
  readonly instrumentName: string;
  readonly resolution: TwChartResolution;
  readonly timeRange: TwRange | undefined;
}
