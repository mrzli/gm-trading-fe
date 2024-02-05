import { ActiveOrder, ActiveTrade } from '@gmjs/gm-trading-shared';
import { TradeProcessState } from '../../types';
import { getOhlc } from '../ohlc';
import { pipAdjust } from '../pip-adjust';

export function processOrders(
  state: TradeProcessState,
  index: number,
  onFillOrder?: (order: ActiveOrder, trade: ActiveTrade) => void,
): TradeProcessState {
  let currentState = state;

  const { activeOrders } = currentState;

  const ordersToRemove = new Set<number>();

  for (const order of activeOrders) {
    currentState = processOrder(
      currentState,
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
    ...currentState,
    activeOrders: remainingOrders,
  };
}

function processOrder(
  state: TradeProcessState,
  index: number,
  order: ActiveOrder,
  ordersToRemove: Set<number>,
  onFillOrder?: (order: ActiveOrder, trade: ActiveTrade) => void,
): TradeProcessState {
  const { barData, activeTrades } = state;

  const time = barData[index].time;

  const checkFillResult = checkFillOrder(state, index, order);
  const { shouldFill, fillPrice } = checkFillResult;

  if (!shouldFill) {
    return state;
  }

  const activeTrade = orderToTrade(
    state,
    order,
    time,
    fillPrice,
  );

  ordersToRemove.add(order.id);

  onFillOrder?.(order, activeTrade);

  return {
    ...state,
    activeTrades: [...activeTrades, activeTrade],
  };
}

interface CheckFillOrderResult {
  readonly shouldFill: boolean;
  readonly fillPrice: number;
}

function checkFillOrder(
  state: TradeProcessState,
  index: number,
  order: ActiveOrder,
): CheckFillOrderResult {
  const { barData, tradingParams } = state;

  const { pipDigit, spread: pointSpread } = tradingParams;
  const spread = pipAdjust(pointSpread, pipDigit);

  const { time, price, amount } = order;
  const isBuy = amount > 0;

  const previousBar = barData[index - 1];
  const currentBar = barData[index];

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
  state: TradeProcessState,
  order: ActiveOrder,
  openTime: number,
  openPrice: number,
): ActiveTrade {
  const { tradingParams } = state;
  const { pipDigit } = tradingParams;

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
