export interface TradeResult {
  readonly pnl: number;
  readonly pnlPoints: number;
  readonly totalTradesCount: number;
  readonly winCount: number;
  readonly lossCount: number;
  readonly winPercent: number;
  readonly lossPercent: number;
  readonly avgWin: number;
  readonly avgLoss: number;
  readonly maxDrawdown: number;
}
