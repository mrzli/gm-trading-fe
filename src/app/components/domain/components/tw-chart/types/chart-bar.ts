import { UTCTimestamp } from 'lightweight-charts';

export interface ChartBar {
  readonly time: UTCTimestamp;
  readonly open: number;
  readonly high: number;
  readonly low: number;
  readonly close: number;
  readonly customValues: ChartBarCustomValues;
}

export interface ChartBarCustomValues {
  readonly realTime: number;
  readonly [key: string]: unknown;
}

export type ChartBars = readonly ChartBar[];
