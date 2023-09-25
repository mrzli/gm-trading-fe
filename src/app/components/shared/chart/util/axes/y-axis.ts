import * as d3 from 'd3';
import { CandlestickChartYScale } from '../scale';

export function getYAxis(
  yScale: CandlestickChartYScale,
  precision: number,
): d3.Axis<d3.NumberValue> {
  return d3
    .axisLeft(yScale)
    .tickFormat((value) => value.valueOf().toFixed(precision));
}
