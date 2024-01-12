import { TickerDataResolution } from '@gmjs/gm-trading-shared';
import { ChartAdditionalSettings } from './chart-additional-settings';
import { ChartTimezone } from './chart-timezone';

export interface ChartSettings {
  readonly instrumentName: string;
  readonly resolution: TickerDataResolution;
  readonly timezone: ChartTimezone;
  readonly additional: ChartAdditionalSettings;
}
