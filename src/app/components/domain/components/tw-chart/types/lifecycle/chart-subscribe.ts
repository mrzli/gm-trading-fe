import { ChartRange } from '../../../../types';
import { ChartBar } from '../chart-bar';

export interface ChartSubscribeInput {
  readonly onCrosshairMove: CrosshairMoveFn;
  readonly onChartClick: ChartMouseClickInternalFn;
  readonly onChartDoubleClick: ChartMouseClickInternalFn;
  readonly onChartTimeRangeChange: ChartTimeRangeChangeFn;
}

export interface Point {
  readonly x: number;
  readonly y: number;
}

export interface ChartMouseClickInternalData {
  readonly index: number | undefined;
  readonly price: number | undefined;
  readonly point: Point | undefined;
}

export type CrosshairMoveFn = (item: ChartBar | undefined) => void;
export type ChartMouseClickInternalFn = (
  data: ChartMouseClickInternalData,
) => void;
export type ChartTimeRangeChangeFn = (range: ChartRange | undefined) => void;

export interface ChartSubscribeResult {
  readonly unsubscribe: () => void;
}
