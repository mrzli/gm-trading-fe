import { TickerDataRow } from '../../../../types';

export interface TwInitInput {
  readonly precision: number;
  readonly data: readonly TickerDataRow[];
  readonly onCrosshairMove: CrosshairMoveFn;
  readonly onChartTimeRangeChange: ChartTimeRangeChangeFn;
}

export interface TwChartApi {
  readonly timeToLogical: TimeToLogicalConverterFn;
}

export type TimeToLogicalConverterFn = (time: number) => number | undefined;

export interface TwRange {
  readonly from: number;
  readonly to: number;
}

export type CrosshairMoveFn = (item: TickerDataRow | undefined) => void;
export type ChartTimeRangeChangeFn = (range: TwRange | undefined) => void;
