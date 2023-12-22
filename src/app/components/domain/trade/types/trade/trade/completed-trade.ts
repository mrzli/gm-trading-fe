import { TradeCloseReason } from './trade-close-reason';

export interface CompletedTrade {
  readonly id: number;
  readonly openTime: number;
  readonly openPrice: number;
  readonly closeTime: number;
  readonly closePrice: number;
  readonly amount: number;
  readonly closeReason: TradeCloseReason;
  readonly pnlPoints: number;
  readonly pnl: number;
}
