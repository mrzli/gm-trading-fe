import { TradeProcessState, ManualTradeActionAny } from '../../types';

export function processManualTradeActions(
  state: TradeProcessState,
  index: number,
): TradeProcessState {
  let currentState = state;

  const { barData, remainingTradeActions } = currentState;
  if (remainingTradeActions.length === 0) {
    return currentState;
  }

  const time = barData[index].time;

  const currentBarNumActions = getCurrentBarNumManualActions(
    time,
    remainingTradeActions,
  );

  if (currentBarNumActions === 0) {
    return currentState;
  }

  const currentBarActions = remainingTradeActions.slice(
    0,
    currentBarNumActions,
  );

  console.log('currentBarActions', currentBarActions);

  for (const action of currentBarActions) {
    currentState = processManualTradeAction(currentState, index, action);
  }

  const remainingActions = remainingTradeActions.slice(currentBarNumActions);

  return {
    ...state,
    remainingTradeActions: remainingActions,
  };
}

function getCurrentBarNumManualActions(
  time: number,
  remainingActions: readonly ManualTradeActionAny[],
): number {
  let count = 0;
  for (const action of remainingActions) {
    if (action.time > time) {
      break;
    }
    count++;
  }

  return count;
}

function processManualTradeAction(
  state: TradeProcessState,
  index: number,
  action: ManualTradeActionAny,
): TradeProcessState {
  return state;
}
