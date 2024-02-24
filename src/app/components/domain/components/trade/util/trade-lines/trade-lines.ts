import { TradingParameters } from '@gmjs/gm-trading-shared';
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

  const orders = getOrderTradeLines(tradeLog, barIndex, pipDigit, pointSpread);
  const trades = getTradeTradeLines(tradeLog, barIndex, pipDigit, pointSpread);

  return [...orders, ...trades];
}
