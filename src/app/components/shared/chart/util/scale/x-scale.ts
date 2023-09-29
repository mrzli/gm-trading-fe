import * as d3 from 'd3';
import { toXDomain } from './x-domain';
import { TickerDataRow, TickerDataResolution } from '../../../../../types';

export type CandlestickChartXScale = d3.ScaleBand<number>;

const PADDING_INNER = 0.5;
const PADDING_OUTER = -(1 - PADDING_INNER) / 2;
const ALIGN = 0.5;

export function getXScale(
  data: readonly TickerDataRow[],
  interval: TickerDataResolution,
  x1: number,
  x2: number,
): CandlestickChartXScale {
  const domain = toXDomain(data, interval);

  return d3
    .scaleBand<number>()
    .domain(domain)
    .range([x1, x2])
    .paddingInner(PADDING_INNER)
    .paddingOuter(PADDING_OUTER)
    .align(ALIGN);
}
