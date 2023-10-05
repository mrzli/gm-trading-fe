export interface CandlestickChartPosition {
  readonly xIndex: number;
  readonly xIndexWidth: number;
  readonly yPrice: number;
  readonly yPriceHeight: number;
}

export interface CandlestickChartItem {
  readonly slotX: number;
  readonly slotWidth: number;
  readonly o: number;
  readonly h: number;
  readonly l: number;
  readonly c: number;
}

export interface CandlestickChartTooltipData {
  readonly ts: number;
  readonly o: number;
  readonly h: number;
  readonly l: number;
  readonly c: number;
}
