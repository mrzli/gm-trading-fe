import {
  TickerDataRow,
  TickerDataResolution,
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
  width: number,
  height: number,
): CandlestickChartScales {
  return {
    xScale: getXScale(data, interval, width),
    yScale: getYScale(valueRange, height),
  };
}
