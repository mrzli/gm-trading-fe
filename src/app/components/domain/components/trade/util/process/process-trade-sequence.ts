import { barReplayMoveSubBar } from '../../../../util';
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
  const { fullData, barIndex } = input;
  const { subBars } = fullData;

  let currentState = getInitialTradeProcessState(input);

  let currentBarIndexes = barReplayMoveSubBar(subBars, 0, 0, 1);

  for (let i = 1; i <= barIndex; i++) {
    currentState = processBar(
      currentState,
      i,
      currentBarIndexes.barIndex,
      barIndex,
    );
    currentBarIndexes = barReplayMoveSubBar(
      subBars,
      currentBarIndexes.barIndex,
      currentBarIndexes.subBarIndex,
      1,
    );
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
  chartVisualBarIndex: number,
  lastReplayBarIndex: number,
): TradeProcessState {
  let currentState = state;

  const currentBarActions =
    currentState.manualTradeActionsByBar.get(index) ?? [];
  const { open, amendOrder, cancelOrder, amendTrade, closeTrade } =
    getManualTradeActionsByType(currentBarActions);

  currentState = processTradesForOpen(currentState, index, chartVisualBarIndex);

  currentState = processManualTradeActionsByType(
    currentState,
    index,
    chartVisualBarIndex,
    open,
  );
  currentState = processManualTradeActionsByType(
    currentState,
    index,
    chartVisualBarIndex,
    amendOrder,
  );
  currentState = processManualTradeActionsByType(
    currentState,
    index,
    chartVisualBarIndex,
    cancelOrder,
  );

  currentState = processOrders(currentState, index, chartVisualBarIndex);

  currentState = processManualTradeActionsByType(
    currentState,
    index,
    chartVisualBarIndex,
    amendTrade,
  );
  currentState = processManualTradeActionsByType(
    currentState,
    index,
    chartVisualBarIndex,
    closeTrade,
  );

  // do not check for lstop-loss limit over the entire last replay bar
  // (because replay is limited to the open of the last replay bar)
  if (index === lastReplayBarIndex) {
    return currentState;
  }

  currentState = processTradesForBar(currentState, index, chartVisualBarIndex);

  return currentState;
}
