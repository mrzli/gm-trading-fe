import { UTCTimestamp } from 'lightweight-charts';

export interface TickerDataRow {
  readonly time: UTCTimestamp;
  readonly open: number;
  readonly high: number;
  readonly low: number;
  readonly close: number;
}
