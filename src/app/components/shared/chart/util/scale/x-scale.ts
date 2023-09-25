import * as d3 from 'd3';
import { toXDomain } from './x-domain';
import { CANDLESTICK_CHART_MARGIN } from '../margin';
import { TickerDataRow, TickerDataResolution } from '../../../../../types';

export type CandlestickChartXScale = d3.ScaleBand<string>;

const PADDING_INNER = 0.5;
const PADDING_OUTER = -(1 - PADDING_INNER) / 2;
const ALIGN = 0.5;

export function getXScale(
  data: readonly TickerDataRow[],
  interval: TickerDataResolution,
  width: number,
): CandlestickChartXScale {
  const domain = toXDomain(data, interval);

  return d3
    .scaleBand()
    .domain(domain)
    .range([
      CANDLESTICK_CHART_MARGIN.left,
      width - CANDLESTICK_CHART_MARGIN.right,
    ])
    .paddingInner(PADDING_INNER)
    .paddingOuter(PADDING_OUTER)
    .align(ALIGN);
}
