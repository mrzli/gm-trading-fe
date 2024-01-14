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
  _index: number,
  action: ManualTradeActionOpen,
): TradeProcessState {
  const { id, time, price, amount, stopLossDistance, limitDistance } =
    action;

  const activeOrder: ActiveOrder = {
    id,
    time,
    price,
    amount,
    stopLossDistance,
    limitDistance,
  };

  // TODO add log entry

  return {
    ...state,
    activeOrders: [...state.activeOrders, activeOrder],
  };
}

function processManualTradeActionAmendOrder(
  state: TradeProcessState,
  _index: number,
  action: ManualTradeActionAmendOrder,
): TradeProcessState {
  const { targetId, price, amount, stopLossDistance, limitDistance } = action;

  const { activeOrders } = state;

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

  // TODO add log entry

  return {
    ...state,
    activeOrders: newActiveOrders,
  };
}

function processManualTradeActionCancelOrder(
  state: TradeProcessState,
  _index: number,
  action: ManualTradeActionCancelOrder,
): TradeProcessState {
  const { targetId } = action;

  const { activeOrders } = state;

  const activeOrder = activeOrders.find((item) => item.id === targetId);
  invariant(
    activeOrder !== undefined,
    `Could not find active order with id: '${targetId}'.`,
  );

  const newActiveOrders = activeOrders.filter(
    (item) => item.id !== activeOrder.id,
  );

  // TODO add log entry

  return {
    ...state,
    activeOrders: newActiveOrders,
  };
}

function processManualTradeActionAmendTrade(
  state: TradeProcessState,
  _index: number,
  action: ManualTradeActionAmendTrade,
): TradeProcessState {
  const { targetId, stopLoss, limit } = action;

  const { activeTrades } = state;

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

  // TODO add log entry

  return {
    ...state,
    activeTrades: newActiveTrades,
  };
}

function processManualTradeActionCloseTrade(
  state: TradeProcessState,
  index: number,
  action: ManualTradeActionCloseTrade,
): TradeProcessState {
  const { targetId } = action;

  const { barData, tradingParams, activeTrades, completedTrades } = state;

  const activeTrade = activeTrades.find((item) => item.id === targetId);
  invariant(
    activeTrade !== undefined,
    `Could not find active trade with id: '${targetId}'.`,
  );

  const { pipDigit, spread: pointSpread } = tradingParams;
  const spread = pipAdjust(pointSpread, pipDigit);

  const { id, amount } = activeTrade;
  const isBuy = amount > 0;

  const currentBar = barData[index];
  const time = currentBar.time;

  // ohlc for closing the trade, which is the opposite of the trade direction
  const ohlc = getOhlc(currentBar, !isBuy, spread);

  const completedTrade = activeTradeToCompletedTrade(
    activeTrade,
    time,
    ohlc.o,
    'manual',
  );

  // TODO add log entry

  const newActiveTrades = activeTrades.filter((item) => item.id !== id);

  return {
    ...state,
    activeTrades: newActiveTrades,
    completedTrades: [...completedTrades, completedTrade],
  };
}
