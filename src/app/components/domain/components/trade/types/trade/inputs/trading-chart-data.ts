import { TickerDataRows } from '../../../../../types';
import { TwChartTimezone } from '../../../../tw-chart/types';

export interface TradingChartData {
  readonly timezone: TwChartTimezone;
  readonly barData: TickerDataRows;
  readonly barIndex: number;
}
