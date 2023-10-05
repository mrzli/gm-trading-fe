export interface CandlestickChartPosition {
  readonly xOffset: number;
  readonly xItemsWidth: number;
  readonly yPrice: number;
  readonly yPriceHeight: number;
}

export interface CandleVisualData {
  readonly y1: number;
  readonly y2: number;
  readonly y3: number;
  readonly y4: number;
  readonly isBull: boolean;
}

export interface CandlestickChartTooltipData {
  readonly ts: number;
  readonly o: number;
  readonly h: number;
  readonly l: number;
  readonly c: number;
}
