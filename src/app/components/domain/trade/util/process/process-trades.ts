import { invariant } from '@gmjs/assert';
import { ActiveTrade, CompletedTrade, TradeProcessState } from '../../types';
import { getOhlc } from './ohlc';

export function processTrades(
  state: TradeProcessState,
  index: number,
): TradeProcessState {
  let currentState = state;

  const { activeTrades } = currentState;

  const tradesToRemove = new Set<number>();

  for (const trade of activeTrades) {
    currentState = processTrade(currentState, index, trade, tradesToRemove);
  }

  const remainingTrades = activeTrades.filter(
    (trade) => !tradesToRemove.has(trade.id),
  );

  return {
    ...currentState,
    activeTrades: remainingTrades,
  };
}

function processTrade(
  state: TradeProcessState,
  index: number,
  trade: ActiveTrade,
  tradesToRemove: Set<number>,
): TradeProcessState {
  const limitIntersectionsResult = checkLimitIntersections(state, index, trade);
  const { intesectionType, price } = limitIntersectionsResult;
  if (intesectionType === 'none') {
    return state;
  }
  const completedTrade = activeTradeToCompletedTrade(
    trade,
    state.barData[index].time,
    price,
    intesectionType === 'stop-loss',
  );

  // TODO add log entry
  tradesToRemove.add(trade.id);

  return {
    ...state,
    completedTrades: [...state.completedTrades, completedTrade],
  };
}

type LimitIntersectionType = 'none' | 'stop-loss' | 'limit';

interface LimitIntersectionsResult {
  readonly intesectionType: LimitIntersectionType;
  readonly price: number;
}

function checkLimitIntersections(
  state: TradeProcessState,
  index: number,
  trade: ActiveTrade,
): LimitIntersectionsResult {
  const { barData, tradingParams } = state;
  const { spread } = tradingParams;

  const { amount, stopLoss, limit } = trade;

  const isBuy = amount > 0;

  const currentBar = barData[index];

  // ohlc for closing the trade, which is the opposite of the trade direction
  const ohlc = getOhlc(currentBar, !isBuy, spread);

  const isPossibleStopLoss =
    stopLoss !== undefined && (isBuy ? ohlc.l <= stopLoss : ohlc.h >= stopLoss);
  const isPossibleLimit =
    limit !== undefined && (isBuy ? ohlc.h >= limit : ohlc.l <= limit);

  if (!isPossibleStopLoss && !isPossibleLimit) {
    return {
      intesectionType: 'none',
      price: 0,
    };
  }

  const isOpenStopLoss =
    isPossibleStopLoss && (isBuy ? ohlc.o <= stopLoss : ohlc.o >= stopLoss);
  if (isOpenStopLoss) {
    return {
      intesectionType: 'stop-loss',
      price: ohlc.o,
    };
  }

  const isOpenLimit =
    isPossibleLimit && (isBuy ? ohlc.o >= limit : ohlc.o <= limit);
  if (isOpenLimit) {
    return {
      intesectionType: 'limit',
      price: ohlc.o,
    };
  }

  if (isPossibleStopLoss && !isPossibleLimit) {
    return {
      intesectionType: 'stop-loss',
      price: stopLoss,
    };
  }

  if (!isPossibleStopLoss && isPossibleLimit) {
    return {
      intesectionType: 'limit',
      price: limit,
    };
  }

  if (isPossibleStopLoss && isPossibleLimit) {
    const isBull = ohlc.c >= ohlc.o;

    // if bar is bullish, assume movement from open to low to high to close
    // if bar is bearish, assume movement from open to high to low to close
    //
    // with above assumptions:
    // if bullish bar -> low is hit first
    // if bearish bar -> high is hit first
    // if buying -> stop loss is low
    // if selling -> stop loss is high
    //
    // stop-loss is hit first if:
    //  - we are buying and the bar is bullish
    //  - we are selling and the bar is bearish
    //
    // exactly the opposite for limit

    const isStopLoss = isBuy === isBull;

    return {
      intesectionType: isStopLoss ? 'stop-loss' : 'limit',
      price: isStopLoss ? stopLoss : limit,
    };
  }

  invariant(
    false,
    'Processing limit intersections, this code should not be reachable.',
  );
}

function activeTradeToCompletedTrade(
  trade: ActiveTrade,
  closeTime: number,
  closePrice: number,
  isStopLoss: boolean,
): CompletedTrade {
  const { id, openTime, openPrice, amount } = trade;

  return {
    id,
    openTime,
    openPrice,
    closeTime,
    closePrice,
    amount,
    closeReason: isStopLoss ? 'stop-loss' : 'limit',
  };
}
