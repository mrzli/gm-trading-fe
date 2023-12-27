import { UTCTimestamp } from 'lightweight-charts';

export interface Bar {
  readonly time: UTCTimestamp;
  readonly open: number;
  readonly high: number;
  readonly low: number;
  readonly close: number;
}

export type Bars = readonly Bar[];

export type GroupedBars = readonly Bars[];
