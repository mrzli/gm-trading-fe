import { TickerDataResolution } from '@gmjs/gm-trading-shared';
import { ChartTimezone } from '../chart-timezone';
import { RightToolbarState } from './right-toolbar-state';

export interface TradingUiState {
  readonly instrumentName: string;
  readonly resolution: TickerDataResolution;
  readonly timezone: ChartTimezone;
  readonly rightToolbarState: RightToolbarState | undefined;
}
