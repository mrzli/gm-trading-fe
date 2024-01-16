import { applyFn } from '@gmjs/apply-function';
import {
  TYPES_OF_TRADE_LINE_OFFSETS,
  TYPES_OF_TRADE_LINE_REPRESENTATIONS,
  TYPES_OF_TRADE_LINE_SOURCES,
  TYPES_OF_TRADE_LINE_TRADE_DIRECTIONS,
  TradeLine,
} from '../../../types';
import { map, crossWith, toArray } from '@gmjs/value-transformers';

const DEFAULT_VALUES: Pick<TradeLine, 'startIndex' | 'endIndex' | 'price'> = {
  startIndex: 5,
  endIndex: 15,
  price: 34_280,
};

const PRICE_INCREMENT = 10;

function createTradeLines(): readonly TradeLine[] {
  const result: readonly TradeLine[] = applyFn(
    TYPES_OF_TRADE_LINE_SOURCES,
    crossWith(
      TYPES_OF_TRADE_LINE_TRADE_DIRECTIONS,
      TYPES_OF_TRADE_LINE_REPRESENTATIONS,
      TYPES_OF_TRADE_LINE_OFFSETS,
    ),
    map(([source, direction, representation, offset], index) => ({
      ...DEFAULT_VALUES,
      price: DEFAULT_VALUES.price + PRICE_INCREMENT * index,
      source,
      direction,
      representation,
      offset,
    })),
    toArray(),
  );

  return result;
}

export const EXAMPLE_TRADE_LINES = createTradeLines();
