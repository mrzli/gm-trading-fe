import { invariant } from '@gmjs/assert';
import {
  ActiveTrade,
  Bar,
  CompletedTrade,
  TradesCollection,
  TradingParameters,
} from '@gmjs/gm-trading-shared';
import { getOhlc } from '../ohlc';
import { activeTradeToCompletedTrade } from './shared';
import { pipAdjust } from '../pip-adjust';

type LimitIntersectionType = 'none' | 'stop-loss' | 'limit';

interface LimitIntersectionsResult {
  readonly intesectionType: LimitIntersectionType;
  readonly price: number;
}

type CheckLimitFn = (
  tradingParameters: TradingParameters,
  data: readonly Bar[],
  index: number,
  trade: ActiveTrade,
) => LimitIntersectionsResult;

export function processTradesForOpen(
  tradingParameters: TradingParameters,
  tradesCollection: TradesCollection,
  data: readonly Bar[],
  index: number,
  onCompleteTrade?: (trade: CompletedTrade) => void,
): TradesCollection {
  return processTradesInternal(
    tradingParameters,
    tradesCollection,
    data,
    index,
    checkLimitIntersectionsForOpen,
    onCompleteTrade,
  );
}

export function processTradesForBar(
  tradingParameters: TradingParameters,
  tradesCollection: TradesCollection,
  data: readonly Bar[],
  index: number,
  onCompleteTrade?: (trade: CompletedTrade) => void,
): TradesCollection {
  return processTradesInternal(
    tradingParameters,
    tradesCollection,
    data,
    index,
    checkLimitIntersectionsForBar,
    onCompleteTrade,
  );
}

function processTradesInternal(
  tradingParameters: TradingParameters,
  tradesCollection: TradesCollection,
  data: readonly Bar[],
  index: number,
  checkLimit: CheckLimitFn,
  onCompleteTrade?: (trade: CompletedTrade) => void,
): TradesCollection {
  let currentTradesCollection = tradesCollection;

  const { activeTrades } = currentTradesCollection;

  const tradesToRemove = new Set<number>();

  for (const trade of activeTrades) {
    currentTradesCollection = processTradeInternal(
      tradingParameters,
      tradesCollection,
      data,
      index,
      trade,
      tradesToRemove,
      checkLimit,
      onCompleteTrade,
    );
  }

  const remainingTrades = activeTrades.filter(
    (trade) => !tradesToRemove.has(trade.id),
  );

  return {
    ...currentTradesCollection,
    activeTrades: remainingTrades,
  };
}

function processTradeInternal(
  tradingParameters: TradingParameters,
  tradesCollection: TradesCollection,
  data: readonly Bar[],
  index: number,
  trade: ActiveTrade,
  tradesToRemove: Set<number>,
  checkLimit: CheckLimitFn,
  onCompleteTrade?: (trade: CompletedTrade) => void,
): TradesCollection {
  const { completedTrades } = tradesCollection;

  const time = data[index].time;

  const limitIntersectionsResult = checkLimit(
    tradingParameters,
    data,
    index,
    trade,
  );
  const { intesectionType, price } = limitIntersectionsResult;
  if (intesectionType === 'none') {
    return tradesCollection;
  }

  const completedTrade = activeTradeToCompletedTrade(
    trade,
    time,
    price,
    intesectionType,
  );

  onCompleteTrade?.(completedTrade);

  tradesToRemove.add(trade.id);

  return {
    ...tradesCollection,
    completedTrades: [...completedTrades, completedTrade],
  };
}

function checkLimitIntersectionsForOpen(
  tradingParameters: TradingParameters,
  data: readonly Bar[],
  index: number,
  trade: ActiveTrade,
): LimitIntersectionsResult {
  const { pipDigit, spread: pointSpread } = tradingParameters;
  const spread = pipAdjust(pointSpread, pipDigit);

  const { amount, stopLoss, limit } = trade;

  const isBuy = amount > 0;

  const currentBar = data[index];

  // ohlc for closing the trade, which is the opposite of the trade direction
  const ohlc = getOhlc(currentBar, !isBuy, spread);

  const isOpenStopLoss =
    stopLoss !== undefined && (isBuy ? ohlc.o <= stopLoss : ohlc.o >= stopLoss);
  if (isOpenStopLoss) {
    return {
      intesectionType: 'stop-loss',
      price: ohlc.o,
    };
  }

  const isOpenLimit =
    limit !== undefined && (isBuy ? ohlc.o >= limit : ohlc.o <= limit);
  if (isOpenLimit) {
    return {
      intesectionType: 'limit',
      price: ohlc.o,
    };
  }

  return {
    intesectionType: 'none',
    price: 0,
  };
}

function checkLimitIntersectionsForBar(
  tradingParameters: TradingParameters,
  data: readonly Bar[],
  index: number,
  trade: ActiveTrade,
): LimitIntersectionsResult {
  const { pipDigit, spread: pointSpread } = tradingParameters;
  const spread = pipAdjust(pointSpread, pipDigit);

  const { amount, stopLoss, limit } = trade;

  const isBuy = amount > 0;

  const currentBar = data[index];

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
    'Processing bar limit intersections, this code should not be reachable.',
  );
}
