import * as d3 from 'd3';
import { CandlestickChartPosition } from '../../types';

export type CandlestickChartYScale = d3.ScaleLinear<number, number, never>;

export function getYScale(
  position: CandlestickChartPosition,
  size: number,
): CandlestickChartYScale {
  const start = position.yCenterPrice - position.yPriceHeight / 2;
  const end = position.yCenterPrice + position.yPriceHeight / 2;

  return d3
    .scaleLinear()
    .domain([start, end])
    .range([size, 0]);
}
