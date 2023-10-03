import * as d3 from 'd3';
import { NumericRange } from '../../../../../types';

export type CandlestickChartYScale = d3.ScaleLinear<number, number, never>;

export function getYScale(
  priceRange: NumericRange,
  size: number,
): CandlestickChartYScale {
  return d3
    .scaleLinear()
    .domain([priceRange.start, priceRange.end])
    .range([size, 0]);
}
