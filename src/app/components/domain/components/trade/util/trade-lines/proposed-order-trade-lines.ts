import { TradeLine } from '../../../../types';
import { OrderInputs, TradeProcessState } from '../../types';
import { pipAdjust } from '../pip-adjust';

export function proposedOrderToTradeLines(
  state: TradeProcessState,
  order: OrderInputs,
): readonly TradeLine[] {
  const { barIndex, tradingParams } = state;
  const { pipDigit, spread: pointSpread } = tradingParams;
  const spread = pipAdjust(pointSpread, pipDigit);

  return [];
}
