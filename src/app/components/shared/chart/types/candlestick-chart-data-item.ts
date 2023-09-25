import { CandlestickChartTooltipData } from "./candlestick-chart-tooltip-data";

export interface CandlestickChartDataItem {
  readonly x: number;
  readonly w: number;
  readonly o: number;
  readonly h: number;
  readonly l: number;
  readonly c: number;
  readonly tooltip: CandlestickChartTooltipData;
}
