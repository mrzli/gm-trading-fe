import { ChartRange } from '../../../types';
import { ChartBar, ChartBars } from './chart-bar';
import { TwPluginsApi } from './plugins';

export interface TwInitInput {
  readonly precision: number;
  // readonly data: ChartBars;
  readonly onCrosshairMove: CrosshairMoveFn;
  readonly onChartClick: ChartMouseClickFn;
  readonly onChartDoubleClick: ChartMouseClickFn;
  readonly onChartTimeRangeChange: ChartTimeRangeChangeFn;
}

export interface TwChartApi {
  readonly setData: SetDataFn;
  readonly getTimeRange: GetTimeRangeFn;
  readonly setTimeRange: SetTimeRangeFn;
  readonly plugins: TwPluginsApi;
}

export type SetDataFn = (data: ChartBars) => void;

export type GetTimeRangeFn = () => ChartRange | undefined;

export type SetTimeRangeFn = (range: ChartRange) => void;

export type CrosshairMoveFn = (item: ChartBar | undefined) => void;

export interface Point {
  readonly x: number;
  readonly y: number;
}

export interface ChartMouseClickInternalData {
  readonly index: number | undefined;
  readonly price: number | undefined;
  readonly point: Point | undefined;
}
export type ChartMouseClickFn = (data: ChartMouseClickInternalData) => void;

export type ChartTimeRangeChangeFn = (range: ChartRange | undefined) => void;
