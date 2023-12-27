import { applyFn } from '@gmjs/apply-function';
import {
  ManualTradeActionAny,
  ManualTradeActionOpen,
  OrderInputs,
  TradingChartData,
} from '../types';
import { maxBy } from '@gmjs/value-transformers';

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
  chartData: TradingChartData,
): ManualTradeActionOpen {
  const { direction, price, amount, stopLossDistance, limitDistance } =
    orderInputs;

  const time = chartData.barData[chartData.barIndex].time;

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
  chartData: TradingChartData,
): ManualTradeActionAny {
  const time = chartData.barData[chartData.barIndex].time;

  return {
    kind: 'close',
    id,
    time,
    targetId,
  };
}
