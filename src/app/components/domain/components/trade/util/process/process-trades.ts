import { ensureNever, invariant } from '@gmjs/assert';
import {
  ActiveTrade,
  TradeLogEntryLimit,
  TradeLogEntryStopLoss,
  TradeProcessState,
} from '../../types';
import { getOhlc } from '../ohlc';
import { activeTradeToCompletedTrade } from './shared';
import { pipAdjust } from '../pip-adjust';

type LimitIntersectionType = 'none' | 'stop-loss' | 'limit';

interface LimitIntersectionsResult {
  readonly intesectionType: LimitIntersectionType;
  readonly price: number;
}

type CheckLimitFn = (
  state: TradeProcessState,
  index: number,
  trade: ActiveTrade,
) => LimitIntersectionsResult;

export function processTradesForOpen(
  state: TradeProcessState,
  index: number,
  chartVisualBarIndex: number,
): TradeProcessState {
  return processTradesInternal(
    state,
    index,
    chartVisualBarIndex,
    checkLimitIntersectionsForOpen,
  );
}

export function processTradesForBar(
  state: TradeProcessState,
  index: number,
  chartVisualBarIndex: number,
): TradeProcessState {
  return processTradesInternal(
    state,
    index,
    chartVisualBarIndex,
    checkLimitIntersectionsForBar,
  );
}

function processTradesInternal(
  state: TradeProcessState,
  index: number,
  chartVisualBarIndex: number,
  checkLimit: CheckLimitFn,
): TradeProcessState {
  let currentState = state;

  const { activeTrades } = currentState;

  const tradesToRemove = new Set<number>();

  for (const trade of activeTrades) {
    currentState = processTradeInternal(
      currentState,
      index,
      chartVisualBarIndex,
      trade,
      tradesToRemove,
      checkLimit,
    );
  }

  const remainingTrades = activeTrades.filter(
    (trade) => !tradesToRemove.has(trade.id),
  );

  return {
    ...currentState,
    activeTrades: remainingTrades,
  };
}

function processTradeInternal(
  state: TradeProcessState,
  index: number,
  chartVisualBarIndex: number,
  trade: ActiveTrade,
  tradesToRemove: Set<number>,
  checkLimit: CheckLimitFn,
): TradeProcessState {
  const { barData, completedTrades, tradeLog } = state;

  const time = barData[index].time;

  const limitIntersectionsResult = checkLimit(state, index, trade);
  const { intesectionType, price } = limitIntersectionsResult;
  if (intesectionType === 'none') {
    return state;
  }
  const completedTrade = activeTradeToCompletedTrade(
    trade,
    time,
    price,
    intesectionType,
  );

  let logEntry: TradeLogEntryStopLoss | TradeLogEntryLimit | undefined;
  if (intesectionType === 'stop-loss') {
    logEntry = {
      kind: 'stop-loss',
      time,
      barIndex: chartVisualBarIndex,
      tradeId: trade.id,
      price,
    } as TradeLogEntryStopLoss;
  } else if (intesectionType === 'limit') {
    logEntry = {
      kind: 'limit',
      time,
      barIndex: chartVisualBarIndex,
      tradeId: trade.id,
      price,
    } as TradeLogEntryLimit;
  } else {
    ensureNever(intesectionType);
  }

  tradesToRemove.add(trade.id);

  return {
    ...state,
    completedTrades: [...completedTrades, completedTrade],
    tradeLog: [...tradeLog, logEntry],
  };
}

function checkLimitIntersectionsForOpen(
  state: TradeProcessState,
  index: number,
  trade: ActiveTrade,
): LimitIntersectionsResult {
  const { barData, tradingParams } = state;

  const { pipDigit, spread: pointSpread } = tradingParams;
  const spread = pipAdjust(pointSpread, pipDigit);

  const { amount, stopLoss, limit } = trade;

  const isBuy = amount > 0;

  const currentBar = barData[index];

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
  state: TradeProcessState,
  index: number,
  trade: ActiveTrade,
): LimitIntersectionsResult {
  const { barData, tradingParams } = state;

  const { pipDigit, spread: pointSpread } = tradingParams;
  const spread = pipAdjust(pointSpread, pipDigit);

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
