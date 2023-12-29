import { TradeProcessState, TradingDataAndInputs } from '../../types';
import {
  getManualTradeActionsByType,
  groupManualTradeActionsByBar,
} from './manual-trade-actions-util';
import { processManualTradeActionsByType } from './process-manual-trade-actions';
import { processOrders } from './process-orders';
import { processTradesForBar, processTradesForOpen } from './process-trades';

export function processTradeSequence(
  input: TradingDataAndInputs,
): TradeProcessState {
  const barIndex = input.barIndex;

  let currentState = getInitialTradeProcessState(input);

  for (let i = 1; i <= barIndex; i++) {
    currentState = processBar(currentState, i, barIndex);
  }

  return currentState;
}

function getInitialTradeProcessState(
  input: TradingDataAndInputs,
): TradeProcessState {
  const { barData, barIndex, inputs } = input;
  const { manualTradeActions, params } = inputs;

  const manualTradeActionsByBar = groupManualTradeActionsByBar(
    manualTradeActions,
    barData,
  );

  return {
    barData,
    barIndex,
    tradingParams: params,
    manualTradeActionsByBar,
    activeOrders: [],
    activeTrades: [],
    completedTrades: [],
    tradeLog: [],
  };
}

function processBar(
  state: TradeProcessState,
  index: number,
  lastReplayBarIndex: number,
): TradeProcessState {
  let currentState = state;

  const currentBarActions =
    currentState.manualTradeActionsByBar.get(index) ?? [];
  const { open, amendOrder, cancelOrder, amendTrade, closeTrade } =
    getManualTradeActionsByType(currentBarActions);

  currentState = processTradesForOpen(currentState, index);

  currentState = processManualTradeActionsByType(currentState, index, open);
  currentState = processManualTradeActionsByType(
    currentState,
    index,
    amendOrder,
  );
  currentState = processManualTradeActionsByType(
    currentState,
    index,
    cancelOrder,
  );

  currentState = processOrders(currentState, index);

  currentState = processManualTradeActionsByType(
    currentState,
    index,
    amendTrade,
  );
  currentState = processManualTradeActionsByType(
    currentState,
    index,
    closeTrade,
  );

  // do not check for lstop-loss limit over the entire last replay bar
  // (because replay is limited to the open of the last replay bar)
  if (index === lastReplayBarIndex) {
    return currentState;
  }

  currentState = processTradesForBar(currentState, index);

  return currentState;
}

// order of processing
// - manual action open (creates active order)
// - manual action amend order (amends active order)
// - manual action cancel order (cancels active order)
// - process orders (fill order -> create active trade)
