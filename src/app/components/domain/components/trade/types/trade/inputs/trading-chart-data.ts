import { Bars, ChartTimezone } from '../../../../../types';

export interface TradingChartData {
  readonly timezone: ChartTimezone;
  readonly barData: Bars;
  readonly barIndex: number;
}
