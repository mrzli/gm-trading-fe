import {
  ActiveOrder,
  ActiveTrade,
  Bar,
  CompletedTrade,
  ManualTradeActionAny,
  TradesCollection,
  TradingParameters,
} from '@gmjs/gm-trading-shared';
import { barReplayMoveSubBar } from '../../../../util';
import {
  ProcessTradeSequenceResult,
  TradeLogEntryAny,
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
import {
  getMarketPrice,
  getLogEntryCreateOrder,
  getLogEntryAmendOrder,
  getLogEntryCancelOrder,
  getLogEntryFillOrder,
  getLogEntryAmendTrade,
  getLogEntryCompleteTrade,
} from './trade-log-util';

export function processTradeSequence(
  input: TradingDataAndInputs,
): ProcessTradeSequenceResult {
  const { barData, fullData, barIndex, inputs } = input;
  const { subBars } = fullData;
  const { params, manualTradeActions } = inputs;
  const { pipDigit, spread: pointSpread } = params;

  const manualTradeActionsByBar = groupManualTradeActionsByBar(
    manualTradeActions,
    barData,
  );

  const getManualTradeActionForBar = (
    index: number,
  ): readonly ManualTradeActionAny[] => {
    return manualTradeActionsByBar.get(index) ?? [];
  };

  let currentTradesCollection: TradesCollection = {
    activeOrders: [],
    activeTrades: [],
    completedTrades: [],
  };
  const tradeLog: TradeLogEntryAny[] = [];

  let currentBarIndexes = barReplayMoveSubBar(subBars, 0, 0, 1);

  for (let i = 1; i <= barIndex; i++) {
    const currentBar = barData[i];
    const eventHandlers = createProcessBarEventHandlers(
      currentBar,
      pipDigit,
      pointSpread,
      currentBarIndexes.barIndex,
      tradeLog,
    );
    currentTradesCollection = processBar(
      params,
      currentTradesCollection,
      barData,
      i,
      barIndex,
      getManualTradeActionForBar,
      eventHandlers,
    );
    currentBarIndexes = barReplayMoveSubBar(
      subBars,
      currentBarIndexes.barIndex,
      currentBarIndexes.subBarIndex,
      1,
    );
  }

  return {
    tradesCollection: currentTradesCollection,
    tradeLog,
  };
}

function processBar(
  tradingParameters: TradingParameters,
  tradesCollection: TradesCollection,
  data: readonly Bar[],
  index: number,
  lastProcessedIndex: number,
  getManualTradeActionForBar: (
    index: number,
  ) => readonly ManualTradeActionAny[],
  eventHandlers?: ProcessBarEventHandlers,
): TradesCollection {
  let currentTradesCollection = tradesCollection;

  const currentBarActions = getManualTradeActionForBar(index);
  const { open, amendOrder, cancelOrder, amendTrade, closeTrade } =
    getManualTradeActionsByType(currentBarActions);

  const {
    handleCreateOrder,
    handleAmendOrder,
    handleCancelOrder,
    handleFillOrder,
    handleAmendTrade,
    handleCompleteTrade,
  } = eventHandlers ?? {};

  currentTradesCollection = processTradesForOpen(
    tradingParameters,
    currentTradesCollection,
    data,
    index,
    handleCompleteTrade,
  );

  for (const action of open) {
    currentTradesCollection = processManualTradeActionOpen(
      tradingParameters,
      currentTradesCollection,
      data,
      index,
      action,
      handleCreateOrder,
    );
  }

  for (const action of amendOrder) {
    currentTradesCollection = processManualTradeActionAmendOrder(
      tradingParameters,
      currentTradesCollection,
      data,
      index,
      action,
      handleAmendOrder,
    );
  }

  for (const action of cancelOrder) {
    currentTradesCollection = processManualTradeActionCancelOrder(
      tradingParameters,
      currentTradesCollection,
      data,
      index,
      action,
      handleCancelOrder,
    );
  }

  // do not do normal order processing over the entire last replay bar
  // (because replay is limited to the open of the last replay bar,
  //   and previous bar close to current bar open is already processed)
  if (index < lastProcessedIndex) {
    currentTradesCollection = processOrders(
      tradingParameters,
      currentTradesCollection,
      data,
      index,
      handleFillOrder,
    );
  }

  for (const action of amendTrade) {
    currentTradesCollection = processManualTradeActionAmendTrade(
      tradingParameters,
      currentTradesCollection,
      data,
      index,
      action,
      handleAmendTrade,
    );
  }

  for (const action of closeTrade) {
    currentTradesCollection = processManualTradeActionCloseTrade(
      tradingParameters,
      currentTradesCollection,
      data,
      index,
      action,
      handleCompleteTrade,
    );
  }

  // do not check for stop-loss/limit over the entire last replay bar
  // (because replay is limited to the open of the last replay bar)
  if (index < lastProcessedIndex) {
    currentTradesCollection = processTradesForBar(
      tradingParameters,
      currentTradesCollection,
      data,
      index,
      handleCompleteTrade,
    );
  }

  return currentTradesCollection;
}

interface ProcessBarEventHandlers {
  readonly handleCreateOrder?: (order: ActiveOrder) => void;
  readonly handleAmendOrder?: (order: ActiveOrder) => void;
  readonly handleCancelOrder?: (order: ActiveOrder) => void;
  readonly handleFillOrder?: (order: ActiveOrder, trade: ActiveTrade) => void;
  readonly handleAmendTrade?: (trade: ActiveTrade) => void;
  readonly handleCompleteTrade?: (trade: CompletedTrade) => void;
}

function createProcessBarEventHandlers(
  currentBar: Bar,
  pipDigit: number,
  pointSpread: number,
  chartVisualBarIndex: number,
  tradeLog: TradeLogEntryAny[],
): ProcessBarEventHandlers {
  return {
    handleCreateOrder: (order: ActiveOrder): void => {
      const marketPrice = getMarketPrice(
        currentBar,
        pipDigit,
        pointSpread,
        order.amount > 0,
      );
      const logEntry = getLogEntryCreateOrder(
        order,
        marketPrice,
        chartVisualBarIndex,
      );
      tradeLog.push(logEntry);
    },
    handleAmendOrder: (order: ActiveOrder): void => {
      const time = currentBar.time;
      const marketPrice = getMarketPrice(
        currentBar,
        pipDigit,
        pointSpread,
        order.amount > 0,
      );
      const logEntry = getLogEntryAmendOrder(
        order,
        time,
        marketPrice,
        chartVisualBarIndex,
      );
      tradeLog.push(logEntry);
    },
    handleCancelOrder: (order: ActiveOrder): void => {
      const time = currentBar.time;
      const logEntry = getLogEntryCancelOrder(order, time, chartVisualBarIndex);
      tradeLog.push(logEntry);
    },
    handleFillOrder: (order: ActiveOrder, trade: ActiveTrade): void => {
      const logEntry = getLogEntryFillOrder(order, trade, chartVisualBarIndex);
      tradeLog.push(logEntry);
    },
    handleAmendTrade: (trade: ActiveTrade): void => {
      const time = currentBar.time;
      const logEntry = getLogEntryAmendTrade(trade, time, chartVisualBarIndex);
      tradeLog.push(logEntry);
    },
    handleCompleteTrade: (trade: CompletedTrade): void => {
      const logEntry = getLogEntryCompleteTrade(trade, chartVisualBarIndex);
      tradeLog.push(logEntry);
    },
  };
}
