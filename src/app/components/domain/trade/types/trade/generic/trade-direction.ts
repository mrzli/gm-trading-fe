export const TYPES_OF_TRADE_DIRECTIONS = ['buy', 'sell'] as const;

export type TradeDirection = (typeof TYPES_OF_TRADE_DIRECTIONS)[number];
