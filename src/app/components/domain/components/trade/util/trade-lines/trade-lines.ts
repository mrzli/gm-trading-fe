import { TradeLine } from '../../../../types';
import { TradeProcessState } from '../../types';
import { pipAdjust } from '../pip-adjust';
import { getOrderTradeLines } from './orders';
import { getTradeTradeLines } from './trades';

export function calculateTradeLines(
  state: TradeProcessState,
): readonly TradeLine[] {
  const { barIndex, tradingParams, tradeLog } = state;
  const { pipDigit, spread: pointSpread } = tradingParams;
  const spread = pipAdjust(pointSpread, pipDigit);

  const orders = getOrderTradeLines(tradeLog, barIndex, spread);
  const trades = getTradeTradeLines(tradeLog, barIndex, spread);

  return [...orders, ...trades];
}
