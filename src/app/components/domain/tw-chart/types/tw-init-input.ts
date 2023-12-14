import { TickerDataRow, TickerDataRows } from '../../../../types';

export interface TwInitInput {
  readonly precision: number;
  // readonly data: TickerDataRows;
  readonly onCrosshairMove: CrosshairMoveFn;
  readonly onChartTimeRangeChange: ChartTimeRangeChangeFn;
}

export interface TwChartApi {
  readonly setData: SetDataFn;
  readonly setTimeRange: SetTimeRangeFn;
}

export type SetDataFn = (data: TickerDataRows) => void;
export type SetTimeRangeFn = (range: TwRange) => void;

export interface TwRange {
  readonly from: number;
  readonly to: number;
}

export type CrosshairMoveFn = (item: TickerDataRow | undefined) => void;
export type ChartTimeRangeChangeFn = (range: TwRange | undefined) => void;
