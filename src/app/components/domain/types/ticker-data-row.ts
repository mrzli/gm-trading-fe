import { UTCTimestamp } from 'lightweight-charts';

export interface TickerDataRow {
  readonly time: UTCTimestamp;
  readonly open: number;
  readonly high: number;
  readonly low: number;
  readonly close: number;
}

export type TickerDataRows = readonly TickerDataRow[];

export type GroupedTickerDataRows = readonly TickerDataRows[];
