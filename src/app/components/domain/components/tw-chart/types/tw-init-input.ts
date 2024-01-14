import { ChartRange } from '../../../types';
import { ChartBar, ChartBars } from './chart-bar';

export interface TwInitInput {
  readonly precision: number;
  // readonly data: ChartBars;
  readonly onCrosshairMove: CrosshairMoveFn;
  readonly onChartTimeRangeChange: ChartTimeRangeChangeFn;
}

export interface TwChartApi {
  readonly setData: SetDataFn;
  readonly getTimeRange: GetTimeRangeFn;
  readonly setTimeRange: SetTimeRangeFn;
}

export type SetDataFn = (data: ChartBars) => void;
export type GetTimeRangeFn = () => ChartRange | undefined;
export type SetTimeRangeFn = (range: ChartRange) => void;

export type CrosshairMoveFn = (item: ChartBar | undefined) => void;
export type ChartTimeRangeChangeFn = (range: ChartRange | undefined) => void;
