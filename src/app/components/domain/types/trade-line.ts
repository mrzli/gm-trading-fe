export const TYPES_OF_TRADE_LINE_SOURCES = ['order', 'trade'] as const;

export type TradeLineSource = (typeof TYPES_OF_TRADE_LINE_SOURCES)[number];

export const TYPES_OF_TRADE_LINE_TRADE_DIRECTIONS = ['buy', 'sell'] as const;

export type TradeLineTradeDirection =
  (typeof TYPES_OF_TRADE_LINE_TRADE_DIRECTIONS)[number];

export const TYPES_OF_TRADE_LINE_REPRESENTATIONS = [
  'price',
  'stop-loss',
  'limit',
] as const;

export type TradeLineRepresentation =
  (typeof TYPES_OF_TRADE_LINE_REPRESENTATIONS)[number];

export const TYPES_OF_TRADE_LINE_OFFSETS = ['mid', 'execution'] as const;

export type TradeLineOffset = (typeof TYPES_OF_TRADE_LINE_OFFSETS)[number];

export interface TradeLine {
  readonly startIndex: number;
  readonly endIndex: number;
  readonly price: number;
  readonly source: TradeLineSource;
  readonly direction: TradeLineTradeDirection;
  readonly representation: TradeLineRepresentation;
  readonly offset: TradeLineOffset;
}
