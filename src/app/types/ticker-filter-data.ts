import { TickerDataResolution } from '@gmjs/gm-trading-shared';

export interface TickerFilterData {
  readonly name: string;
  readonly resolution: TickerDataResolution | '';
  readonly fromDate: string;
  readonly toDate: string;
}
