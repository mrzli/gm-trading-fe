import * as d3 from 'd3';
import { toXDomain } from './x-domain';
import { TickerDataRow } from '../../../../../../app/types';
import { TickerDataResolution } from '@gmjs/gm-trading-shared';
import { CandlestickChartPosition } from '../../types';

export type CandlestickChartXScale = d3.ScaleBand<number>;

const PADDING_INNER = 0.5;
const PADDING_OUTER = -(1 - PADDING_INNER) / 2;
const ALIGN = 0.5;

export function getXScale(
  data: readonly TickerDataRow[],
  interval: TickerDataResolution,
  _position: CandlestickChartPosition,
  size: number,
): CandlestickChartXScale {
  const domain = toXDomain(data, interval);

  return d3
    .scaleBand<number>()
    .domain(domain)
    .range([0, size])
    .paddingInner(PADDING_INNER)
    .paddingOuter(PADDING_OUTER)
    .align(ALIGN);
}
