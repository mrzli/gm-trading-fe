import { invariant } from '@gmjs/assert';
import {
  ActiveOrder,
  ActiveTrade,
  Bar,
  CompletedTrade,
  ManualTradeActionAmendOrder,
  ManualTradeActionAmendTrade,
  ManualTradeActionCancelOrder,
  ManualTradeActionCloseTrade,
  ManualTradeActionOpen,
  TradesCollection,
  TradingParameters,
} from '@gmjs/gm-trading-shared';
import { activeTradeToCompletedTrade } from './shared';
import { getOhlc } from '../ohlc';
import { pipAdjust } from '../pip-adjust';

export function processManualTradeActionOpen(
  _tradingParameters: TradingParameters,
  tradesCollection: TradesCollection,
  data: readonly Bar[],
  index: number,
  action: ManualTradeActionOpen,
  onCreateOrder?: (order: ActiveOrder) => void,
): TradesCollection {
  const { activeOrders } = tradesCollection;

  const { id, price, amount, stopLossDistance, limitDistance } = action;

  const currentBar = data[index];
  const time = currentBar.time;

  const activeOrder: ActiveOrder = {
    id,
    time,
    price,
    amount,
    stopLossDistance,
    limitDistance,
  };

  onCreateOrder?.(activeOrder);

  return {
    ...tradesCollection,
    activeOrders: [...activeOrders, activeOrder],
  };
}

export function processManualTradeActionAmendOrder(
  _tradingParameters: TradingParameters,
  tradesCollection: TradesCollection,
  data: readonly Bar[],
  _index: number,
  action: ManualTradeActionAmendOrder,
  onAmendOrder?: (order: ActiveOrder) => void,
): TradesCollection {
  const { activeOrders } = tradesCollection;

  const { targetId, price, amount, stopLossDistance, limitDistance } = action;

  const activeOrderIndex = activeOrders.findIndex(
    (item) => item.id === targetId,
  );
  invariant(
    activeOrderIndex !== -1,
    `Could not find active order with id: '${targetId}'.`,
  );

  const activeOrder = activeOrders[activeOrderIndex];

  const updatedActiveOrder: ActiveOrder = {
    ...activeOrder,
    price,
    amount,
    stopLossDistance,
    limitDistance,
  };

  const newActiveOrders = activeOrders.with(
    activeOrderIndex,
    updatedActiveOrder,
  );

  onAmendOrder?.(updatedActiveOrder);

  return {
    ...tradesCollection,
    activeOrders: newActiveOrders,
  };
}

export function processManualTradeActionCancelOrder(
  _tradingParameters: TradingParameters,
  tradesCollection: TradesCollection,
  data: readonly Bar[],
  _index: number,
  action: ManualTradeActionCancelOrder,
  onCancelOrder?: (order: ActiveOrder) => void,
): TradesCollection {
  const { activeOrders } = tradesCollection;

  const { targetId } = action;

  const activeOrder = activeOrders.find((item) => item.id === targetId);
  invariant(
    activeOrder !== undefined,
    `Could not find active order with id: '${targetId}'.`,
  );

  const newActiveOrders = activeOrders.filter(
    (item) => item.id !== activeOrder.id,
  );

  onCancelOrder?.(activeOrder);

  return {
    ...tradesCollection,
    activeOrders: newActiveOrders,
  };
}

export function processManualTradeActionAmendTrade(
  _tradingParameters: TradingParameters,
  tradesCollection: TradesCollection,
  data: readonly Bar[],
  _index: number,
  action: ManualTradeActionAmendTrade,
  onAmendTrade?: (trade: ActiveTrade) => void,
): TradesCollection {
  const { activeTrades } = tradesCollection;

  const { targetId, stopLoss, limit } = action;

  const activeTradeIndex = activeTrades.findIndex(
    (item) => item.id === targetId,
  );
  invariant(
    activeTradeIndex !== -1,
    `Could not find active trade with id: '${targetId}'.`,
  );

  const activeOrder = activeTrades[activeTradeIndex];

  // TODO (several things)
  // check if the amend is valid, throw if not
  //  - stop loss cannot be less than x distance from entry, and needs to be in the proper direction
  //  - limit cannot be less than x distance from entry, and needs to be in the proper direction

  const updatedActiveTrade: ActiveTrade = {
    ...activeOrder,
    stopLoss,
    limit,
  };

  const newActiveTrades = activeTrades.with(
    activeTradeIndex,
    updatedActiveTrade,
  );

  onAmendTrade?.(updatedActiveTrade);

  return {
    ...tradesCollection,
    activeTrades: newActiveTrades,
  };
}

export function processManualTradeActionCloseTrade(
  tradingParameters: TradingParameters,
  tradesCollection: TradesCollection,
  data: readonly Bar[],
  index: number,
  action: ManualTradeActionCloseTrade,
  onCloseTrade?: (trade: CompletedTrade) => void,
): TradesCollection {
  const { activeTrades, completedTrades } = tradesCollection;

  const { targetId } = action;

  const currentBar = data[index];
  const time = currentBar.time;

  const activeTrade = activeTrades.find((item) => item.id === targetId);
  invariant(
    activeTrade !== undefined,
    `Could not find active trade with id: '${targetId}'.`,
  );

  const { pipDigit, spread: pointSpread } = tradingParameters;
  const spread = pipAdjust(pointSpread, pipDigit);

  const { id, amount } = activeTrade;
  const isBuy = amount > 0;

  // ohlc for closing the trade, which is the opposite of the trade direction
  const ohlc = getOhlc(currentBar, !isBuy, spread);

  const completedTrade = activeTradeToCompletedTrade(
    activeTrade,
    time,
    ohlc.o,
    'manual',
  );

  const newActiveTrades = activeTrades.filter((item) => item.id !== id);

  onCloseTrade?.(completedTrade);

  return {
    ...tradesCollection,
    activeTrades: newActiveTrades,
    completedTrades: [...completedTrades, completedTrade],
  };
}
