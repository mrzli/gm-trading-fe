export interface TradeResult {
  readonly pnl: number;
  readonly pnlPoints: number;
  readonly totalCount: number;
  readonly winCount: number;
  readonly lossCount: number;
  readonly winFraction: number;
  readonly lossFraction: number;
  readonly avgWin: number;
  readonly avgLoss: number;
  readonly avgWinPts: number;
  readonly avgLossPts: number;
  readonly maxDrawdown: number;
}
