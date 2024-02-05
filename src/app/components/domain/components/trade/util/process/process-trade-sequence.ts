import {
  ActiveOrder,
  ActiveTrade,
  CompletedTrade,
} from '@gmjs/gm-trading-shared';
import { barReplayMoveSubBar } from '../../../../util';
import {
  ProcessTradeSequenceResult,
  TradeLogEntryAmendOrder,
  TradeLogEntryAmendTrade,
  TradeLogEntryAny,
  TradeLogEntryCancelOrder,
  TradeLogEntryCloseTrade,
  TradeLogEntryCreateOrder,
  TradeLogEntryFillOrder,
  TradeLogEntryLimit,
  TradeLogEntryStopLoss,
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
import { pipAdjust } from '../pip-adjust';
import { getOhlc } from '../ohlc';
import { ensureNever } from '@gmjs/assert';

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
      currentBarIndexes.barIndex,
      barIndex,
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
  chartVisualBarIndex: number,
  lastReplayBarIndex: number,
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
  if (index < lastReplayBarIndex) {
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
  if (index < lastReplayBarIndex) {
    currentState = processTradesForBar(
      currentState,
      index,
      handleCompleteTrade,
    );
  }

  return currentState;
}

function getMarketPrice(
  state: TradeProcessState,
  index: number,
  isBuy: boolean,
): number {
  const { barData, tradingParams } = state;
  const { pipDigit, spread: pointSpread } = tradingParams;
  const spread = pipAdjust(pointSpread, pipDigit);
  const currentBar = barData[index];
  const ohlc = getOhlc(currentBar, isBuy, spread);
  return ohlc.o;
}

function getLogEntryCreateOrder(
  order: ActiveOrder,
  marketPrice: number,
  chartVisualBarIndex: number,
): TradeLogEntryAny {
  const logEntry: TradeLogEntryCreateOrder = {
    kind: 'create-order',
    time: order.time,
    barIndex: chartVisualBarIndex,
    orderId: order.id,
    price: order.price,
    marketPrice,
    amount: order.amount,
    stopLossDistance: order.stopLossDistance,
    limitDistance: order.limitDistance,
  };
  return logEntry;
}

function getLogEntryAmendOrder(
  order: ActiveOrder,
  time: number,
  marketPrice: number,
  chartVisualBarIndex: number,
): TradeLogEntryAny {
  const logEntry: TradeLogEntryAmendOrder = {
    kind: 'amend-order',
    time,
    barIndex: chartVisualBarIndex,
    orderId: order.id,
    price: order.price,
    marketPrice,
    amount: order.amount,
    stopLossDistance: order.stopLossDistance,
    limitDistance: order.limitDistance,
  };
  return logEntry;
}

function getLogEntryCancelOrder(
  order: ActiveOrder,
  time: number,
  chartVisualBarIndex: number,
): TradeLogEntryAny {
  const logEntry: TradeLogEntryCancelOrder = {
    kind: 'cancel-order',
    time,
    barIndex: chartVisualBarIndex,
    orderId: order.id,
  };
  return logEntry;
}

function getLogEntryFillOrder(
  order: ActiveOrder,
  trade: ActiveTrade,
  chartVisualBarIndex: number,
): TradeLogEntryAny {
  const logEntry: TradeLogEntryFillOrder = {
    kind: 'fill-order',
    time: trade.openTime,
    barIndex: chartVisualBarIndex,
    orderId: order.id,
    tradeId: trade.id,
    amount: trade.amount,
    price: trade.openPrice,
    stopLoss: trade.stopLoss,
    limit: trade.limit,
  };
  return logEntry;
}

function getLogEntryAmendTrade(
  trade: ActiveTrade,
  time: number,
  chartVisualBarIndex: number,
): TradeLogEntryAny {
  const logEntry: TradeLogEntryAmendTrade = {
    kind: 'amend-trade',
    time,
    barIndex: chartVisualBarIndex,
    tradeId: trade.id,
    stopLoss: trade.stopLoss,
    limit: trade.limit,
  };
  return logEntry;
}

function getLogEntryCompleteTrade(
  trade: CompletedTrade,
  chartVisualBarIndex: number,
): TradeLogEntryAny {
  const { id, closeTime, closePrice, closeReason } = trade;

  switch (closeReason) {
    case 'stop-loss': {
      const logEntry: TradeLogEntryStopLoss = {
        kind: 'stop-loss',
        time: closeTime,
        barIndex: chartVisualBarIndex,
        tradeId: id,
        price: closePrice,
      };
      return logEntry;
    }
    case 'limit': {
      const logEntry: TradeLogEntryLimit = {
        kind: 'limit',
        time: closeTime,
        barIndex: chartVisualBarIndex,
        tradeId: id,
        price: closePrice,
      };
      return logEntry;
    }
    case 'manual': {
      const logEntry: TradeLogEntryCloseTrade = {
        kind: 'close-trade',
        time: closeTime,
        barIndex: chartVisualBarIndex,
        tradeId: id,
        price: closePrice,
      }
      return logEntry;
    }
    default: {
      return ensureNever(closeReason);
    }
  }
}
