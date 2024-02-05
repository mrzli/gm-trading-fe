import { TradingParameters, pipAdjust } from '@gmjs/gm-trading-shared';
import { TradeLine } from '../../../../types';
import { ProcessTradeSequenceResult } from '../../types';
import { getOrderTradeLines } from './orders';
import { getTradeTradeLines } from './trades';

export function calculateTradeLines(
  tradingParameters: TradingParameters,
  barIndex: number,
  tradeResult: ProcessTradeSequenceResult,
): readonly TradeLine[] {
  const { tradeLog } = tradeResult;
  const { pipDigit, spread: pointSpread } = tradingParameters;
  const spread = pipAdjust(pointSpread, pipDigit);

  const orders = getOrderTradeLines(tradeLog, barIndex, spread);
  const trades = getTradeTradeLines(tradeLog, barIndex, spread);

  return [...orders, ...trades];
}
