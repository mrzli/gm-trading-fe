import { TickerDataRow } from '../../../types';
import { Ohlc } from '../../types';

export function getOhlc(
  bar: TickerDataRow,
  isBuy: boolean,
  spread: number,
): Ohlc {
  return isBuy ? toOhlcBuy(bar, spread) : toOhlcSell(bar, spread);
}

function toOhlcBuy(row: TickerDataRow, spread: number): Ohlc {
  return toOhlc(row, spread / 2);
}

function toOhlcSell(row: TickerDataRow, spread: number): Ohlc {
  return toOhlc(row, -spread / 2);
}

function toOhlc(row: TickerDataRow, adjustment: number): Ohlc {
  const { open, high, low, close } = row;

  return {
    o: open + adjustment,
    h: high + adjustment,
    l: low + adjustment,
    c: close + adjustment,
  };
}
