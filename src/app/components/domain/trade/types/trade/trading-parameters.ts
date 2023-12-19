export interface TradingParameters {
  readonly initialBalance: number;
  readonly priceDecimals: number;
  readonly spread: number;
  readonly marginPercent: number;
  readonly avgSlippage: number;
  readonly pipDigit: number;
  readonly minStopLossDistance: number;
}
