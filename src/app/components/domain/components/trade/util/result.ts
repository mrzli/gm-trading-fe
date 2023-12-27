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
import { CompletedTrade, TradeProcessState, TradeResult } from '../types';

export function calculateTradeResults(state: TradeProcessState): TradeResult {
  const { completedTrades } = state;

  const pnlList = applyFn(
    completedTrades,
    map((item) => getCompletedTradePnl(item)),
    toArray(),
  );

  const pnlPointsList = applyFn(
    completedTrades,
    map((item) => getCompletedTradePnlPoints(item)),
    toArray(),
  );

  const pnl = applyFn(pnlList, sum());
  const pnlPoints = applyFn(pnlPointsList, sum());

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

  const totalCount = completedTrades.length;
  const winCount = winPnlList.length;
  const lossCount = lossPnlList.length;

  const winFraction = totalCount > 0 ? winCount / totalCount : 0;
  const lossFraction = totalCount > 0 ? lossCount / totalCount : 0;

  const avgWin = applyFn(winPnlList, mean());
  const avgLoss = applyFn(lossPnlList, mean());

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
    maxDrawdown,
  };
}

export function getCompletedTradePnlPoints(trade: CompletedTrade): number {
  const { closePrice, openPrice, amount } = trade;
  return (closePrice - openPrice) * Math.sign(amount);
}

export function getCompletedTradePnl(trade: CompletedTrade): number {
  const { closePrice, openPrice, amount } = trade;
  return (closePrice - openPrice) * amount;
}