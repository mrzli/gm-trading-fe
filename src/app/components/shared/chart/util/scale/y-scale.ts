import * as d3 from 'd3';
import { CANDLESTICK_CHART_MARGIN } from '../margin';
import { NumericRange } from '../../../../../types';

export type CandlestickChartYScale = d3.ScaleLinear<number, number, never>;

export function getYScale(
  valueRange: NumericRange,
  height: number,
): CandlestickChartYScale {
  return d3
    .scaleLinear()
    .domain([valueRange.start, valueRange.end])
    .range([
      height - CANDLESTICK_CHART_MARGIN.bottom,
      CANDLESTICK_CHART_MARGIN.top,
    ]);
}
