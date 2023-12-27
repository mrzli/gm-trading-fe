import { ActiveTrade, TradeCloseReason, CompletedTrade } from '../../types';

export function activeTradeToCompletedTrade(
  trade: ActiveTrade,
  closeTime: number,
  closePrice: number,
  closeReason: TradeCloseReason,
): CompletedTrade {
  const { id, openTime, openPrice, amount } = trade;

  return {
    id,
    openTime,
    openPrice,
    closeTime,
    closePrice,
    amount,
    closeReason,
  };
}
