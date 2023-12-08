import { TickerDataResolution } from '@gmjs/gm-trading-shared';

export interface TickerFilterData {
  readonly name: string;
  readonly resolution: TickerDataResolution | '';
  readonly date: string | '';
}
