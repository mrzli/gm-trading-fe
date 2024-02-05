import { applyFn } from '@gmjs/apply-function';
import {
  cumSum,
  filter,
  map,
  mean,
  min,
  sum,
  toArray,
} from '@gmjs/value-transformers';
import { TradeProcessState, TradeResult } from '../types';
import { getOhlc } from './ohlc';
import { Bar } from '../../../types';
import { pipAdjustInverse } from '.';
import { ActiveTrade, CompletedTrade } from '@gmjs/gm-trading-shared';

export function calculateTradeResults(
  state: TradeProcessState,
  pipDigit: number,
): TradeResult {
  const { completedTrades } = state;

  const pnlList = applyFn(
    completedTrades,
    map((item) => getCompletedTradePnl(item, pipDigit)),
    toArray(),
  );
  const pnl = applyFn(pnlList, sum());

  const winPnlList = applyFn(
    pnlList,
    filter((v) => v > 0),
    toArray(),
  );
  const lossPnlList = applyFn(
    pnlList,
    filter((v) => v <= 0),
    toArray(),
  );

  const pnlPointsList = applyFn(
    completedTrades,
    map((item) => getCompletedTradePnlPoints(item, pipDigit)),
    toArray(),
  );
  const pnlPoints = applyFn(pnlPointsList, sum());

  const winPnlPointsList = applyFn(
    pnlPointsList,
    filter((v) => v > 0),
    toArray(),
  );
  const lossPnlPointsList = applyFn(
    pnlPointsList,
    filter((v) => v <= 0),
    toArray(),
  );

  const totalCount = completedTrades.length;
  const winCount = winPnlList.length;
  const lossCount = lossPnlList.length;

  const winFraction = totalCount > 0 ? winCount / totalCount : 0;
  const lossFraction = totalCount > 0 ? lossCount / totalCount : 0;

  const avgWin = applyFn(winPnlList, mean());
  const avgLoss = applyFn(lossPnlList, mean());

  const avgWinPts = applyFn(winPnlPointsList, mean());
  const avgLossPts = applyFn(lossPnlPointsList, mean());

  const maxDrawdown = applyFn(pnlList, cumSum(), min(), (v) => Math.min(0, v));

  return {
    pnl,
    pnlPoints,
    totalCount,
    winCount,
    lossCount,
    winFraction,
    lossFraction,
    avgWin,
    avgLoss,
    avgWinPts,
    avgLossPts,
    maxDrawdown,
  };
}

export function getActiveTradePnlPoints(
  trade: ActiveTrade,
  bar: Bar,
  pipDigit: number,
  spread: number,
): number {
  const { openPrice, amount } = trade;

  const isBuy = amount > 0;

  // ohlc for closing the trade, which is the opposite of the trade direction
  const ohlc = getOhlc(bar, !isBuy, spread);

  const pointDiff = pipAdjustInverse(ohlc.o - openPrice, pipDigit);
  return pointDiff * Math.sign(amount);
}

export function getActiveTradePnl(
  trade: ActiveTrade,
  bar: Bar,
  pipDigit: number,
  spread: number,
): number {
  const { openPrice, amount } = trade;

  const isBuy = amount > 0;

  // ohlc for closing the trade, which is the opposite of the trade direction
  const ohlc = getOhlc(bar, !isBuy, spread);

  const pointDiff = pipAdjustInverse(ohlc.o - openPrice, pipDigit);
  return pointDiff * amount;
}

export function getCompletedTradePnlPoints(
  trade: CompletedTrade,
  pipDigit: number,
): number {
  const { closePrice, openPrice, amount } = trade;
  const pointDiff = pipAdjustInverse(closePrice - openPrice, pipDigit);
  return pointDiff * Math.sign(amount);
}

export function getCompletedTradePnl(
  trade: CompletedTrade,
  pipDigit: number,
): number {
  const { closePrice, openPrice, amount } = trade;
  const pointDiff = pipAdjustInverse(closePrice - openPrice, pipDigit);
  return pointDiff * amount;
}
