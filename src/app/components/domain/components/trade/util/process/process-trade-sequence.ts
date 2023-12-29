import { TradeProcessState, TradingDataAndInputs } from '../../types';
import { groupManualTradeActionsByBar } from './manual-trade-actions-util';
import { processManualTradeActions } from './process-manual-trade-actions';
import { processOrders } from './process-orders';
import { processTrades } from './process-trades';

export function processTradeSequence(
  input: TradingDataAndInputs,
): TradeProcessState {
  const barIndex = input.barIndex;

  let currentState = getInitialTradeProcessState(input);

  for (let i = 1; i <= barIndex; i++) {
    currentState = processManualTradeActions(currentState, i);
    if (i < barIndex) {
      currentState = processOrders(currentState, i);
      currentState = processTrades(currentState, i);
    }
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
