import { TickerDataRow } from '../../../../../types';
import { Ohlc } from '../../types';

export function toOhlcBuy(row: TickerDataRow, spread: number): Ohlc {
  return toOhlc(row, spread / 2);
}

export function toOhlcSell(row: TickerDataRow, spread: number): Ohlc {
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
