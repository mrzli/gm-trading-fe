import {
  ActiveOrder,
  ActiveTrade,
  Bar,
  TradesCollection,
  TradingParameters,
} from '@gmjs/gm-trading-shared';
import { getOhlc } from '../ohlc';
import { pipAdjust } from '../pip-adjust';

export function processOrders(
  tradingParameters: TradingParameters,
  tradesCollection: TradesCollection,
  data: readonly Bar[],
  index: number,
  onFillOrder?: (order: ActiveOrder, trade: ActiveTrade) => void,
): TradesCollection {
  let currentTradesCollection = tradesCollection;

  const { activeOrders } = currentTradesCollection;

  const ordersToRemove = new Set<number>();

  for (const order of activeOrders) {
    currentTradesCollection = processOrder(
      tradingParameters,
      tradesCollection,
      data,
      index,
      order,
      ordersToRemove,
      onFillOrder,
    );
  }

  const remainingOrders = activeOrders.filter(
    (order) => !ordersToRemove.has(order.id),
  );

  return {
    ...currentTradesCollection,
    activeOrders: remainingOrders,
  };
}

function processOrder(
  tradingParameters: TradingParameters,
  tradesCollection: TradesCollection,
  data: readonly Bar[],
  index: number,
  order: ActiveOrder,
  ordersToRemove: Set<number>,
  onFillOrder?: (order: ActiveOrder, trade: ActiveTrade) => void,
): TradesCollection {
  const { activeTrades } = tradesCollection;

  const time = data[index].time;

  const checkFillResult = checkFillOrder(tradingParameters, data, index, order);
  const { shouldFill, fillPrice } = checkFillResult;

  if (!shouldFill) {
    return tradesCollection;
  }

  const activeTrade = orderToTrade(tradingParameters, order, time, fillPrice);

  ordersToRemove.add(order.id);

  onFillOrder?.(order, activeTrade);

  return {
    ...tradesCollection,
    activeTrades: [...activeTrades, activeTrade],
  };
}

interface CheckFillOrderResult {
  readonly shouldFill: boolean;
  readonly fillPrice: number;
}

function checkFillOrder(
  tradingParameters: TradingParameters,
  data: readonly Bar[],
  index: number,
  order: ActiveOrder,
): CheckFillOrderResult {
  const { pipDigit, spread: pointSpread } = tradingParameters;
  const spread = pipAdjust(pointSpread, pipDigit);

  const { time, price, amount } = order;
  const isBuy = amount > 0;

  const previousBar = data[index - 1];
  const currentBar = data[index];

  const prevOhlc = getOhlc(previousBar, isBuy, spread);
  const ohlc = getOhlc(currentBar, isBuy, spread);

  if (price === undefined) {
    return {
      shouldFill: true,
      fillPrice: ohlc.o,
    };
  } else if (
    time < currentBar.time &&
    isBetweenInclusive(price, prevOhlc.c, ohlc.o)
  ) {
    return {
      shouldFill: true,
      fillPrice: ohlc.o,
    };
  } else if (isBetweenInclusive(price, ohlc.l, ohlc.h)) {
    return {
      shouldFill: true,
      fillPrice: price,
    };
  } else {
    return {
      shouldFill: false,
      fillPrice: 0,
    };
  }
}

function isBetweenInclusive(value: number, v1: number, v2: number): boolean {
  const min = Math.min(v1, v2);
  const max = Math.max(v1, v2);
  return value >= min && value <= max;
}

function orderToTrade(
  tradingParameters: TradingParameters,
  order: ActiveOrder,
  openTime: number,
  openPrice: number,
): ActiveTrade {
  const { pipDigit } = tradingParameters;

  const {
    id,
    amount,
    stopLossDistance: pointStopLossDistance,
    limitDistance: pointLimitDistance,
  } = order;

  const stopLossDistance =
    pointStopLossDistance === undefined
      ? undefined
      : pipAdjust(pointStopLossDistance, pipDigit);
  const limitDistance =
    pointLimitDistance === undefined
      ? undefined
      : pipAdjust(pointLimitDistance, pipDigit);

  const isBuy = amount > 0;

  return {
    id,
    openTime,
    openPrice,
    amount,
    stopLoss: getStopLossPrice(isBuy, openPrice, stopLossDistance),
    limit: getLimitPrice(isBuy, openPrice, limitDistance),
  };
}

function getStopLossPrice(
  isBuy: boolean,
  openPrice: number,
  stopLossDistance: number | undefined,
): number | undefined {
  if (stopLossDistance === undefined) {
    return undefined;
  }

  return isBuy ? openPrice - stopLossDistance : openPrice + stopLossDistance;
}

function getLimitPrice(
  isBuy: boolean,
  openPrice: number,
  limitDistance: number | undefined,
): number | undefined {
  if (limitDistance === undefined) {
    return undefined;
  }

  return isBuy ? openPrice + limitDistance : openPrice - limitDistance;
}
