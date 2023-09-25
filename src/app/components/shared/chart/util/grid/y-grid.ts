import { CANDLESTICK_CHART_MARGIN } from "..";
import { CandlestickChartD3GSelectionFn } from "../../types";
import { CandlestickChartYScale } from "../scale";

export function getYGrid(
  yScale: CandlestickChartYScale,
  width: number,
): CandlestickChartD3GSelectionFn {
  return (g) =>
    g
      .selectAll('line')
      .data(yScale.ticks())
      .join('line')
      .attr('x1', 0)
      .attr('y1', (d) => yScale(d))
      .attr(
        'x2',
        width - CANDLESTICK_CHART_MARGIN.left - CANDLESTICK_CHART_MARGIN.right,
      )
      .attr('y2', (d) => yScale(d))
      .attr('stroke', 'black')
      .attr('stroke-opacity', 0.1);
}