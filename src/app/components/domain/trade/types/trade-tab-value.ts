export const TYPES_OF_TRADE_TAB_VALUES = [
  'trade-inputs',
  'trading-display',
  'trade-log',
  'results',
] as const;

export type TradeTabValue = (typeof TYPES_OF_TRADE_TAB_VALUES)[number];
