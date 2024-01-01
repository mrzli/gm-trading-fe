import { ChartResolution } from '../chart-resolution';
import { ChartTimezone } from '../chart-timezone';
import { RightToolbarState } from './right-toolbar-state';

export interface TradingUiState {
  readonly instrumentName: string;
  readonly resolution: ChartResolution;
  readonly timezone: ChartTimezone;
  readonly rightToolbarState: RightToolbarState | undefined;
}
