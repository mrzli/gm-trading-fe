import { TradingParameters } from '@gmjs/gm-trading-shared';
import { TradeResult } from '../types';

export const DEFAULT_TRADING_PARAMS: TradingParameters = {
  initialBalance: 10_000,
  priceDecimals: 1,
  spread: 1,
  marginPercent: 0.5,
  avgSlippage: 0,
  pipDigit: 0,
  minStopLossDistance: 6,
};

export const EMPTY_TRADE_RESULTS: TradeResult = {
  pnl: 0,
  pnlPoints: 0,
  totalCount: 0,
  winCount: 0,
  lossCount: 0,
  winFraction: 0,
  lossFraction: 0,
  avgWin: 0,
  avgLoss: 0,
  avgWinPts: 0,
  avgLossPts: 0,
  maxDrawdown: 0,
};
