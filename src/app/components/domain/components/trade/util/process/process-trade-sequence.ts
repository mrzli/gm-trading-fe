import { TradeProcessState, TradingDataAndInputs } from '../../types';
import { sortManualTradeActions } from './sort-manual-trade-actions';
import { processManualTradeActions } from './process-manual-trade-actions';
import { processOrders } from './process-orders';
import { processTrades } from './process-trades';

export function processTradeSequence(
  input: TradingDataAndInputs,
): TradeProcessState {
  const barIndex = input.barIndex;

  let tradeProcessState = getInitialTradeProcessState(input);

  for (let i = 1; i <= barIndex; i++) {
    tradeProcessState = processBar(tradeProcessState, i);
  }

  return tradeProcessState;
}

function getInitialTradeProcessState(
  input: TradingDataAndInputs,
): TradeProcessState {
  const { barData, barIndex, inputs } = input;
  const { manualTradeActions, params } = inputs;

  const remainingManualActions = sortManualTradeActions(manualTradeActions);

  return {
    barData,
    barIndex,
    tradingParams: params,
    remainingManualActions,
    activeOrders: [],
    activeTrades: [],
    completedTrades: [],
    tradeLog: [],
  };
}

function processBar(
  state: TradeProcessState,
  index: number,
): TradeProcessState {
  let currentState = state;

  currentState = processManualTradeActions(currentState, index);
  currentState = processOrders(currentState, index);
  currentState = processTrades(currentState, index);

  return currentState;
}
