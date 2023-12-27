import { ChartResolution } from './chart-resolution';
import { ChartTimezone } from './chart-timezone';

export interface ChartSettings {
  readonly instrumentName: string;
  readonly resolution: ChartResolution;
  readonly timezone: ChartTimezone;
}
