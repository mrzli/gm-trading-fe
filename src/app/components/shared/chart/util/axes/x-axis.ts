import * as d3 from 'd3';
import { parseIntegerOrThrow } from '@gmjs/number-util';
import { CandlestickChartXScale } from '../scale';
import { timestampToIsoDatetime } from '../../../../../util';

export function getXAxis(
  xScale: CandlestickChartXScale,
): d3.Axis<string> {
  return d3.axisBottom(xScale).tickFormat(dateFormat);
}

function dateFormat(tsStr: string, _index: number): string {
  return timestampToIsoDatetime(parseIntegerOrThrow(tsStr));
}
