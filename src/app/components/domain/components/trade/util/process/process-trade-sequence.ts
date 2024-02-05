import {
  ActiveOrder,
  ActiveTrade,
  CompletedTrade,
} from '@gmjs/gm-trading-shared';
import { barReplayMoveSubBar } from '../../../../util';
import {
  ProcessTradeSequenceResult,
  TradeLogEntryAny,
  TradeProcessState,
  TradingDataAndInputs,
} from '../../types';
import {
  getManualTradeActionsByType,
  groupManualTradeActionsByBar,
} from './manual-trade-actions-util';
import {
  processManualTradeActionAmendOrder,
  processManualTradeActionAmendTrade,
  processManualTradeActionCancelOrder,
  processManualTradeActionCloseTrade,
  processManualTradeActionOpen,
} from './process-manual-trade-actions';
import { processOrders } from './process-orders';
import { processTradesForBar, processTradesForOpen } from './process-trades';
import { getMarketPrice, getLogEntryCreateOrder, getLogEntryAmendOrder, getLogEntryCancelOrder, getLogEntryFillOrder, getLogEntryAmendTrade, getLogEntryCompleteTrade } from './trade-log-util';

export function processTradeSequence(
  input: TradingDataAndInputs,
): ProcessTradeSequenceResult {
  const { fullData, barIndex } = input;
  const { subBars } = fullData;

  let currentState = getInitialTradeProcessState(input);
  const tradeLog: TradeLogEntryAny[] = [];

  let currentBarIndexes = barReplayMoveSubBar(subBars, 0, 0, 1);

  for (let i = 1; i <= barIndex; i++) {
    currentState = processBar(
      currentState,
      i,
      barIndex,
      currentBarIndexes.barIndex,
      tradeLog,
    );
    currentBarIndexes = barReplayMoveSubBar(
      subBars,
      currentBarIndexes.barIndex,
      currentBarIndexes.subBarIndex,
      1,
    );
  }

  return {
    state: currentState,
    tradeLog,
  };
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
  };
}

function processBar(
  state: TradeProcessState,
  index: number,
  lastProcessedIndex: number,
  chartVisualBarIndex: number,
  tradeLog: TradeLogEntryAny[],
): TradeProcessState {
  let currentState = state;

  const currentBarActions =
    currentState.manualTradeActionsByBar.get(index) ?? [];
  const { open, amendOrder, cancelOrder, amendTrade, closeTrade } =
    getManualTradeActionsByType(currentBarActions);

  const handleCreateOrder = (order: ActiveOrder): void => {
    const marketPrice = getMarketPrice(state, index, order.amount > 0);
    const logEntry = getLogEntryCreateOrder(
      order,
      marketPrice,
      chartVisualBarIndex,
    );
    tradeLog.push(logEntry);
  };

  const handleAmendOrder = (order: ActiveOrder): void => {
    const time = state.barData[index].time;
    const marketPrice = getMarketPrice(state, index, order.amount > 0);
    const logEntry = getLogEntryAmendOrder(
      order,
      time,
      marketPrice,
      chartVisualBarIndex,
    );
    tradeLog.push(logEntry);
  };

  const handleCancelOrder = (order: ActiveOrder): void => {
    const time = state.barData[index].time;
    const logEntry = getLogEntryCancelOrder(order, time, chartVisualBarIndex);
    tradeLog.push(logEntry);
  };

  const handleFillOrder = (order: ActiveOrder, trade: ActiveTrade): void => {
    const logEntry = getLogEntryFillOrder(order, trade, chartVisualBarIndex);
    tradeLog.push(logEntry);
  };

  const handleAmendTrade = (trade: ActiveTrade): void => {
    const time = state.barData[index].time;
    const logEntry = getLogEntryAmendTrade(trade, time, chartVisualBarIndex);
    tradeLog.push(logEntry);
  };

  const handleCompleteTrade = (trade: CompletedTrade): void => {
    const logEntry = getLogEntryCompleteTrade(trade, chartVisualBarIndex);
    tradeLog.push(logEntry);
  };

  currentState = processTradesForOpen(currentState, index, handleCompleteTrade);

  for (const action of open) {
    currentState = processManualTradeActionOpen(
      currentState,
      index,
      action,
      handleCreateOrder,
    );
  }

  for (const action of amendOrder) {
    currentState = processManualTradeActionAmendOrder(
      currentState,
      index,
      action,
      handleAmendOrder,
    );
  }

  for (const action of cancelOrder) {
    currentState = processManualTradeActionCancelOrder(
      currentState,
      index,
      action,
      handleCancelOrder,
    );
  }

  // do not do normal order processing over the entire last replay bar
  // (because replay is limited to the open of the last replay bar,
  //   and previous bar close to current bar open is already processed)
  if (index < lastProcessedIndex) {
    currentState = processOrders(currentState, index, handleFillOrder);
  }

  for (const action of amendTrade) {
    currentState = processManualTradeActionAmendTrade(
      currentState,
      index,
      action,
      handleAmendTrade,
    );
  }

  for (const action of closeTrade) {
    currentState = processManualTradeActionCloseTrade(
      currentState,
      index,
      action,
      handleCompleteTrade,
    );
  }

  // do not check for stop-loss/limit over the entire last replay bar
  // (because replay is limited to the open of the last replay bar)
  if (index < lastProcessedIndex) {
    currentState = processTradesForBar(
      currentState,
      index,
      handleCompleteTrade,
    );
  }

  return currentState;
}
