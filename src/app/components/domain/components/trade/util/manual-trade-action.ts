import { applyFn } from '@gmjs/apply-function';
import {
  ManualTradeActionAny,
  ManualTradeActionOpen,
  OrderInputs,
} from '../types';
import { maxBy } from '@gmjs/value-transformers';
import { Bars } from '../../../types';

export function getNextManualActionId(
  tradeActions: readonly ManualTradeActionAny[],
): number {
  if (tradeActions.length === 0) {
    return 0;
  }

  const maxManualActionId = applyFn(
    tradeActions,
    maxBy((a) => a.id),
  );

  return maxManualActionId + 1;
}

export function createManualTradeActionOpen(
  orderInputs: OrderInputs,
  id: number,
  barData: Bars,
  barIndex: number,
): ManualTradeActionOpen {
  const { direction, price, amount, stopLossDistance, limitDistance } =
    orderInputs;

  const time = barData[barIndex].time;

  return {
    kind: 'open',
    id,
    time,
    price,
    amount: direction === 'buy' ? amount : -amount,
    stopLossDistance,
    limitDistance,
  };
}

export function createManualTradeActionClose(
  id: number,
  targetId: number,
  barData: Bars,
  barIndex: number,
): ManualTradeActionAny {
  const time = barData[barIndex].time;

  return {
    kind: 'close',
    id,
    time,
    targetId,
  };
}
