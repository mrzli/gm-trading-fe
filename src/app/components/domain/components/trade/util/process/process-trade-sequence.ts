import {
  ActiveOrder,
  ActiveTrade,
  Bar,
  CompletedTrade,
  ManualTradeActionAny,
  ProcessBarEventHandlers,
  TradesCollection,
  processBarForTrade,
} from '@gmjs/gm-trading-shared';
import { barReplayMoveSubBar } from '../../../../util';
import {
  ProcessTradeSequenceResult,
  TradeLogEntryAny,
  TradingDataAndInputs,
} from '../../types';
import { groupManualTradeActionsByBar } from './manual-trade-actions-util';
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
    currentTradesCollection = processBarForTrade(
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
