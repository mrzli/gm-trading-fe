import { TwChartResolution } from './tw-chart-resolution';
import { TwRange, TwTimeRange } from './tw-init-input';

export interface TwChartSettings {
  readonly instrumentName: string;
  readonly resolution: TwChartResolution;
  readonly timeRange: TwTimeRange | undefined;
  readonly logicalRange: TwRange | undefined;
}
