import * as d3 from 'd3';
import { NumericRange } from '../../../../../types';

export type CandlestickChartYScale = d3.ScaleLinear<number, number, never>;

export function getYScale(
  valueRange: NumericRange,
  y1: number,
  y2: number,
): CandlestickChartYScale {
  return d3
    .scaleLinear()
    .domain([valueRange.start, valueRange.end])
    .range([y1, y2]);
}
