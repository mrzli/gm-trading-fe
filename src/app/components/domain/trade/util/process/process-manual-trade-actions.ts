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
} from '../../types';

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

  const remainingActions = applyFn(
    remainingManualActions,
    filter((item) => !(item.time <= time)),
    toArray(),
  );

  return {
    ...state,
    remainingManualActions: remainingActions,
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
  // TODO
  // create active order
  // add log entry

  return state;
}

function processManualTradeActionClose(
  state: TradeProcessState,
  index: number,
  action: ManualTradeActionClose,
): TradeProcessState {
  // TODO
  // find active order or trade, throw if not found
  // if found order, cancel order, add log entry
  // if found trade, close trade, add log entry

  return state;
}

function processManualTradeActionAmendOrder(
  state: TradeProcessState,
  index: number,
  action: ManualTradeActionAmendOrder,
): TradeProcessState {
  // TODO
  // find active order, throw if not found
  // amend order, add log entry

  return state;
}

function processManualTradeActionAmendTrade(
  state: TradeProcessState,
  index: number,
  action: ManualTradeActionAmendTrade,
): TradeProcessState {
  // TODO
  // find active trade, throw if not found
  // check if the amend is valid, throw if not
  //  - stop loss cannot be less than x distance from entry, and needs to be in the proper direction
  //  - limit cannot be less than x distance from entry, and needs to be in the proper direction
  // amend trade, add log entry

  return state;
}
