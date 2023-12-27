import { Bar } from '../../../../types';
import { Ohlc } from '../../types';

export function getOhlc(bar: Bar, isBuy: boolean, spread: number): Ohlc {
  return isBuy ? toOhlcBuy(bar, spread) : toOhlcSell(bar, spread);
}

function toOhlcBuy(bar: Bar, spread: number): Ohlc {
  return toOhlc(bar, spread / 2);
}

function toOhlcSell(bar: Bar, spread: number): Ohlc {
  return toOhlc(bar, -spread / 2);
}

function toOhlc(bar: Bar, adjustment: number): Ohlc {
  const { open, high, low, close } = bar;

  return {
    o: open + adjustment,
    h: high + adjustment,
    l: low + adjustment,
    c: close + adjustment,
  };
}
