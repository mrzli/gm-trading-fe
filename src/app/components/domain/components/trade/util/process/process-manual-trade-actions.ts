import { invariant } from '@gmjs/assert';
import { applyFn } from '@gmjs/apply-function';
import { filter, toArray } from '@gmjs/value-transformers';
import {
  TradeProcessState,
  ManualTradeActionAny,
  ManualTradeActionOpen,
  ManualTradeActionClose,
  ManualTradeActionAmendOrder,
  ManualTradeActionAmendTrade,
  ActiveOrder,
  ActiveTrade,
} from '../../types';
import { activeTradeToCompletedTrade } from './shared';
import { getOhlc } from '../ohlc';

export function processManualTradeActions(
  state: TradeProcessState,
  index: number,
): TradeProcessState {
  let currentState = state;

  const { barData, remainingManualActions } = currentState;

  const time = barData[index].time;

  const currentBarActions = applyFn(
    remainingManualActions,
    filter((item) => item.time <= time),
    toArray(),
  );

  for (const action of currentBarActions) {
    currentState = processManualTradeAction(currentState, index, action);
  }

  const newRemainingManualActions = applyFn(
    remainingManualActions,
    filter((item) => !(item.time <= time)),
    toArray(),
  );

  return {
    ...currentState,
    remainingManualActions: newRemainingManualActions,
  };
}

function processManualTradeAction(
  state: TradeProcessState,
  index: number,
  action: ManualTradeActionAny,
): TradeProcessState {
  const { kind } = action;

  switch (kind) {
    case 'open': {
      return processManualTradeActionOpen(state, index, action);
    }
    case 'close': {
      return processManualTradeActionClose(state, index, action);
    }
    case 'amend-order': {
      return processManualTradeActionAmendOrder(state, index, action);
    }
    case 'amend-trade': {
      return processManualTradeActionAmendTrade(state, index, action);
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
  const activeOrder: ActiveOrder = {
    ...action,
  };

  // TODO add log entry

  return {
    ...state,
    activeOrders: [...state.activeOrders, activeOrder],
  };
}

function processManualTradeActionClose(
  state: TradeProcessState,
  index: number,
  action: ManualTradeActionClose,
): TradeProcessState {
  const { targetId } = action;

  const {
    barData,
    tradingParams,
    activeOrders,
    activeTrades,
    completedTrades,
  } = state;

  const activeOrder = activeOrders.find((item) => item.id === targetId);
  if (activeOrder) {
    const newActiveOrders = activeOrders.filter(
      (item) => item.id !== activeOrder.id,
    );

    // TODO add log entry

    return {
      ...state,
      activeOrders: newActiveOrders,
    };
  }

  const activeTrade = activeTrades.find((item) => item.id === targetId);
  if (activeTrade) {
    const { spread } = tradingParams;
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

  invariant(
    false,
    `Could not find active order or active trade with id: '${targetId}'.`,
  );
}

function processManualTradeActionAmendOrder(
  state: TradeProcessState,
  index: number,
  action: ManualTradeActionAmendOrder,
): TradeProcessState {
  const { targetId, price, amount, stopLossDistance, limitDistance } = action;

  const { activeOrders } = state;

  const activeOrderIndex = activeOrders.findIndex(
    (item) => item.id !== targetId,
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

function processManualTradeActionAmendTrade(
  state: TradeProcessState,
  index: number,
  action: ManualTradeActionAmendTrade,
): TradeProcessState {
  const { targetId, stopLoss, limit } = action;

  const { activeTrades } = state;

  const activeTradeIndex = activeTrades.findIndex(
    (item) => item.id !== targetId,
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
