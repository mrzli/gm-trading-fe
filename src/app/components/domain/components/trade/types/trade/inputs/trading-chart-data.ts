import { TickerDataRows, ChartTimezone } from '../../../../../types';

export interface TradingChartData {
  readonly timezone: ChartTimezone;
  readonly barData: TickerDataRows;
  readonly barIndex: number;
}
