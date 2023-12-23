import { ActiveOrder, ActiveTrade, TradeProcessState } from '../../types';
import { toOhlcBuy, toOhlcSell } from './ohlc';

export function processOrders(
  state: TradeProcessState,
  index: number,
): TradeProcessState {
  let currentState = state;

  const { activeOrders } = currentState;

  const ordersToRemove = new Set<number>();

  for (const order of activeOrders) {
    currentState = processOrder(currentState, index, order, ordersToRemove);
  }

  const remainingOrders = activeOrders.filter(
    (order) => !ordersToRemove.has(order.id),
  );

  return {
    ...state,
    activeOrders: remainingOrders,
  };
}

function processOrder(
  state: TradeProcessState,
  index: number,
  order: ActiveOrder,
  ordersToRemove: Set<number>,
): TradeProcessState {
  const { barData, tradingParams, activeTrades } = state;
  const { spread } = tradingParams;

  const checkFillResult = checkFillOrder(state, index, order);
  const { shouldFill, fillPrice } = checkFillResult;

  if (!shouldFill) {
    return state;
  }

  const activeTrade = orderToTrade(
    order,
    barData[index].time,
    fillPrice,
    spread,
  );

  ordersToRemove.add(order.id);

  // TODO add log entry

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
  const { spread } = tradingParams;

  const { id, time, price, amount } = order;
  const isBuy = amount > 0;

  const previousBar = barData[index - 1];
  const currentBar = barData[index];

  const prevOhlcBuy = toOhlcBuy(previousBar, spread);
  const prevOhlcSell = toOhlcSell(previousBar, spread);
  const ohlcBuy = toOhlcBuy(currentBar, spread);
  const ohlcSell = toOhlcSell(currentBar, spread);

  const prevClose = isBuy ? prevOhlcBuy.c : prevOhlcSell.c;
  const currOpen = isBuy ? ohlcBuy.o : ohlcSell.o;
  const currLow = isBuy ? ohlcBuy.l : ohlcSell.l;
  const currHigh = isBuy ? ohlcBuy.h : ohlcSell.h;

  if (price === undefined) {
    return {
      shouldFill: true,
      fillPrice: currOpen,
    };
  } else if (
    time < currentBar.time &&
    price >= prevClose &&
    price <= currOpen
  ) {
    return {
      shouldFill: true,
      fillPrice: currOpen,
    };
  } else if (price >= currLow && price <= currHigh) {
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

function orderToTrade(
  order: ActiveOrder,
  openTime: number,
  openPrice: number,
  spread: number,
): ActiveTrade {
  const { id, amount, stopLossDistance, limitDistance } = order;
  const isBuy = amount > 0;

  return {
    id,
    openTime,
    openPrice,
    amount,
    stopLoss: getStopLossPrice(isBuy, openPrice, stopLossDistance, spread),
    limit: getLimitPrice(isBuy, openPrice, limitDistance, spread),
    pnlPoints: 0, // will not be 0 at start due to spread, but will be calculated when processing trades
    pnl: 0, // as above
  };
}

function getStopLossPrice(
  isBuy: boolean,
  openPrice: number,
  stopLossDistance: number | undefined,
  spread: number,
): number | undefined {
  if (stopLossDistance === undefined) {
    return undefined;
  }

  const finalSlDistance = stopLossDistance - spread;

  return isBuy ? openPrice - finalSlDistance : openPrice + finalSlDistance;
}

function getLimitPrice(
  isBuy: boolean,
  openPrice: number,
  limitDistance: number | undefined,
  spread: number,
): number | undefined {
  if (limitDistance === undefined) {
    return undefined;
  }

  const finalLimitDistance = limitDistance + spread;

  return isBuy
    ? openPrice + finalLimitDistance
    : openPrice - finalLimitDistance;
}
