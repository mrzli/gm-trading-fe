import { applyFn } from '@gmjs/apply-function';
import {
  AmendOrderData,
  AmendTradeData,
  ManualTradeActionAmendOrder,
  ManualTradeActionAmendTrade,
  ManualTradeActionAny,
  ManualTradeActionClose,
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
  targetId: number,
  id: number,
  barData: Bars,
  barIndex: number,
): ManualTradeActionClose {
  const time = barData[barIndex].time;

  return {
    kind: 'close',
    id,
    time,
    targetId,
  };
}

export function createManualTradeActionAmendOrder(
  data: AmendOrderData,
  id: number,
  barData: Bars,
  barIndex: number,
): ManualTradeActionAmendOrder {
  const { id: targetId, price, amount, stopLossDistance, limitDistance } = data;

  const time = barData[barIndex].time;

  return {
    kind: 'amend-order',
    id,
    time,
    targetId,
    price,
    amount,
    stopLossDistance,
    limitDistance,
  };
}

export function createManualTradeActionAmendTrade(
  data: AmendTradeData,
  id: number,
  barData: Bars,
  barIndex: number,
): ManualTradeActionAmendTrade {
  const { id: targetId, stopLoss, limit } = data;

  const time = barData[barIndex].time;

  return {
    kind: 'amend-trade',
    id,
    time,
    targetId,
    stopLoss,
    limit,
  };
}
