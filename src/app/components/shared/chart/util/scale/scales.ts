import { TickerDataResolution } from '@gmjs/gm-trading-shared';
import {
  TickerDataRow,
  NumericRange,
} from '../../../../../types';
import { CandlestickChartXScale, getXScale } from './x-scale';
import { CandlestickChartYScale, getYScale } from './y-scale';

export interface CandlestickChartScales {
  readonly xScale: CandlestickChartXScale;
  readonly yScale: CandlestickChartYScale;
}

export function getScales(
  data: readonly TickerDataRow[],
  interval: TickerDataResolution,
  valueRange: NumericRange,
  x1: number,
  x2: number,
  y1: number,
  y2: number,
): CandlestickChartScales {
  return {
    xScale: getXScale(data, interval, x1, x2),
    yScale: getYScale(valueRange, y1, y2),
  };
}
