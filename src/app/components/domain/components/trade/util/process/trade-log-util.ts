import { ensureNever } from '@gmjs/assert';
import {
  ActiveOrder,
  ActiveTrade,
  Bar,
  CompletedTrade,
  getOhlc,
  pipAdjust,
} from '@gmjs/gm-trading-shared';
import {
  TradeLogEntryAny,
  TradeLogEntryCreateOrder,
  TradeLogEntryAmendOrder,
  TradeLogEntryCancelOrder,
  TradeLogEntryFillOrder,
  TradeLogEntryAmendTrade,
  TradeLogEntryStopLoss,
  TradeLogEntryLimit,
  TradeLogEntryCloseTrade,
} from '../../types';

export function getMarketPrice(
  currentBar: Bar,
  pipDigit: number,
  pointSpread: number,
  isBuy: boolean,
): number {
  const spread = pipAdjust(pointSpread, pipDigit);
  const ohlc = getOhlc(currentBar, isBuy, spread);
  return ohlc.o;
}

export function getLogEntryCreateOrder(
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

export function getLogEntryAmendOrder(
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

export function getLogEntryCancelOrder(
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

export function getLogEntryFillOrder(
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

export function getLogEntryAmendTrade(
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

export function getLogEntryCompleteTrade(
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
      };
      return logEntry;
    }
    default: {
      return ensureNever(closeReason);
    }
  }
}
