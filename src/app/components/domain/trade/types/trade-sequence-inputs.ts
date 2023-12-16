export interface TradeSequenceInput {
  readonly initialBalance: number;
  readonly spread: number;
  readonly marginPercent: number;
  readonly avgSlippage: number;
}
