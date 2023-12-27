import { ChartRange, Bar, Bars } from '../../../types';

export interface TwInitInput {
  readonly precision: number;
  // readonly data: Bars;
  readonly onCrosshairMove: CrosshairMoveFn;
  readonly onChartTimeRangeChange: ChartTimeRangeChangeFn;
}

export interface TwChartApi {
  readonly setData: SetDataFn;
  readonly getTimeRange: GetTimeRangeFn;
  readonly setTimeRange: SetTimeRangeFn;
}

export type SetDataFn = (data: Bars) => void;
export type GetTimeRangeFn = () => ChartRange | undefined;
export type SetTimeRangeFn = (range: ChartRange) => void;

export type CrosshairMoveFn = (item: Bar | undefined) => void;
export type ChartTimeRangeChangeFn = (range: ChartRange | undefined) => void;
