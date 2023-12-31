import { ChartResolution } from '..';
import { ChartTimezone } from '../chart-timezone';

export interface TradingUiState {
  readonly instrumentName: string;
  readonly resolution: ChartResolution;
  readonly timezone: ChartTimezone;
}
