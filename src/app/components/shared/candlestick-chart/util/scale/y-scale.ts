import * as d3 from 'd3';
import { NumericRange } from '../../../../../types';

export type CandlestickChartYScale = d3.ScaleLinear<number, number, never>;

export function getYScale(
  valueRange: NumericRange,
  size: number,
): CandlestickChartYScale {
  return d3
    .scaleLinear()
    .domain([valueRange.start, valueRange.end])
    .range([size, 0]);
}
