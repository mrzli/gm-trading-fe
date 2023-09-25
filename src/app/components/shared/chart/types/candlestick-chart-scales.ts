import type * as d3 from 'd3';

export type CandlestickChartXScale = d3.ScaleBand<string>;
export type CandlestickChartYScale = d3.ScaleLinear<number, number, never>;

export interface CandlestickChartScales {
  readonly xScale: CandlestickChartXScale;
  readonly yScale: CandlestickChartYScale;
}
