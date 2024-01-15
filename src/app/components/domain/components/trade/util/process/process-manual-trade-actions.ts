import { invariant } from '@gmjs/assert';
import {
  TradeProcessState,
  ManualTradeActionOpen,
  ManualTradeActionAmendOrder,
  ManualTradeActionAmendTrade,
  ActiveOrder,
  ActiveTrade,
  ManualTradeActionAny,
  ManualTradeActionCloseTrade,
  ManualTradeActionCancelOrder,
  TradeLogEntryCreateOrder,
  TradeLogEntryAmendOrder,
  TradeLogEntryCancelOrder,
  TradeLogEntryAmendTrade,
  TradeLogEntryCloseTrade,
} from '../../types';
import { activeTradeToCompletedTrade } from './shared';
import { getOhlc } from '../ohlc';
import { pipAdjust } from '../pip-adjust';

export function processManualTradeActionsByType<T extends ManualTradeActionAny>(
  state: TradeProcessState,
  index: number,
  actions: readonly T[],
): TradeProcessState {
  let currentState = state;

  for (const action of actions) {
    currentState = processManualTradeAction(currentState, index, action);
  }

  return currentState;
}

export function processManualTradeAction<T extends ManualTradeActionAny>(
  state: TradeProcessState,
  index: number,
  action: T,
): TradeProcessState {
  const { kind } = action;

  switch (kind) {
    case 'open': {
      return processManualTradeActionOpen(state, index, action);
    }
    case 'amend-order': {
      return processManualTradeActionAmendOrder(state, index, action);
    }
    case 'cancel-order': {
      return processManualTradeActionCancelOrder(state, index, action);
    }
    case 'amend-trade': {
      return processManualTradeActionAmendTrade(state, index, action);
    }
    case 'close-trade': {
      return processManualTradeActionCloseTrade(state, index, action);
    }
    default: {
      invariant(false, `Unknown action kind: '${kind}'.`);
    }
  }
}

function processManualTradeActionOpen(
  state: TradeProcessState,
  index: number,
  action: ManualTradeActionOpen,
): TradeProcessState {
  const { barData, tradingParams, activeOrders, tradeLog } = state;

  const { pipDigit, spread: pointSpread } = tradingParams;
  const spread = pipAdjust(pointSpread, pipDigit);

  const { id, price, amount, stopLossDistance, limitDistance } = action;

  const currentBar = barData[index];
  const time = currentBar.time;

  const isBuy = amount > 0;

  const ohlc = getOhlc(currentBar, isBuy, spread);

  const activeOrder: ActiveOrder = {
    id,
    time,
    price,
    amount,
    stopLossDistance,
    limitDistance,
  };

  const logEntry: TradeLogEntryCreateOrder = {
    kind: 'create-order',
    time,
    barIndex: index,
    orderId: id,
    price,
    marketPrice: ohlc.o,
    amount,
    stopLossDistance,
    limitDistance,
  };

  return {
    ...state,
    activeOrders: [...activeOrders, activeOrder],
    tradeLog: [...tradeLog, logEntry],
  };
}

function processManualTradeActionAmendOrder(
  state: TradeProcessState,
  index: number,
  action: ManualTradeActionAmendOrder,
): TradeProcessState {
  const { barData, tradingParams, activeOrders, tradeLog } = state;

  const { pipDigit, spread: pointSpread } = tradingParams;
  const spread = pipAdjust(pointSpread, pipDigit);

  const { targetId, price, amount, stopLossDistance, limitDistance } = action;

  const currentBar = barData[index];
  const time = currentBar.time;

  const isBuy = amount > 0;

  const ohlc = getOhlc(currentBar, isBuy, spread);

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

  const logEntry: TradeLogEntryAmendOrder = {
    kind: 'amend-order',
    time,
    barIndex: index,
    orderId: targetId,
    price,
    marketPrice: ohlc.o,
    amount,
    stopLossDistance,
    limitDistance,
  };

  return {
    ...state,
    activeOrders: newActiveOrders,
    tradeLog: [...tradeLog, logEntry],
  };
}

function processManualTradeActionCancelOrder(
  state: TradeProcessState,
  index: number,
  action: ManualTradeActionCancelOrder,
): TradeProcessState {
  const { barData, activeOrders, tradeLog } = state;

  const { targetId } = action;

  const time = barData[index].time;

  const activeOrder = activeOrders.find((item) => item.id === targetId);
  invariant(
    activeOrder !== undefined,
    `Could not find active order with id: '${targetId}'.`,
  );

  const newActiveOrders = activeOrders.filter(
    (item) => item.id !== activeOrder.id,
  );

  const logEntry: TradeLogEntryCancelOrder = {
    kind: 'cancel-order',
    time,
    barIndex: index,
    orderId: targetId,
  };

  return {
    ...state,
    activeOrders: newActiveOrders,
    tradeLog: [...tradeLog, logEntry],
  };
}

function processManualTradeActionAmendTrade(
  state: TradeProcessState,
  index: number,
  action: ManualTradeActionAmendTrade,
): TradeProcessState {
  const { barData, activeTrades, tradeLog } = state;

  const { targetId, stopLoss, limit } = action;

  const time = barData[index].time;

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

  const logEntry: TradeLogEntryAmendTrade = {
    kind: 'amend-trade',
    time,
    barIndex: index,
    tradeId: targetId,
    stopLoss,
    limit,
  };

  return {
    ...state,
    activeTrades: newActiveTrades,
    tradeLog: [...tradeLog, logEntry],
  };
}

function processManualTradeActionCloseTrade(
  state: TradeProcessState,
  index: number,
  action: ManualTradeActionCloseTrade,
): TradeProcessState {
  const { barData, tradingParams, activeTrades, completedTrades, tradeLog } =
    state;

  const { targetId } = action;

  const currentBar = barData[index];
  const time = currentBar.time;

  const activeTrade = activeTrades.find((item) => item.id === targetId);
  invariant(
    activeTrade !== undefined,
    `Could not find active trade with id: '${targetId}'.`,
  );

  const { pipDigit, spread: pointSpread } = tradingParams;
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

  const logEntry: TradeLogEntryCloseTrade = {
    kind: 'close-trade',
    time,
    barIndex: index,
    tradeId: targetId,
    price: ohlc.o,
  };

  return {
    ...state,
    activeTrades: newActiveTrades,
    completedTrades: [...completedTrades, completedTrade],
    tradeLog: [...tradeLog, logEntry],
  };
}
