import { TradeLine } from '../../../../types';
import { ProcessTradeSequenceResult } from '../../types';
import { pipAdjust } from '../pip-adjust';
import { getOrderTradeLines } from './orders';
import { getTradeTradeLines } from './trades';

export function calculateTradeLines(
  tradeResult: ProcessTradeSequenceResult,
): readonly TradeLine[] {
  const { state, tradeLog } = tradeResult;
  const { barIndex, tradingParams } = state;
  const { pipDigit, spread: pointSpread } = tradingParams;
  const spread = pipAdjust(pointSpread, pipDigit);

  const orders = getOrderTradeLines(tradeLog, barIndex, spread);
  const trades = getTradeTradeLines(tradeLog, barIndex, spread);

  return [...orders, ...trades];
}
