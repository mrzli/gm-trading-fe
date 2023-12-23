export interface ActiveTrade {
  readonly id: number;
  readonly openTime: number;
  readonly openPrice: number;
  readonly amount: number;
  readonly stopLoss: number | undefined;
  readonly limit: number | undefined;
}
