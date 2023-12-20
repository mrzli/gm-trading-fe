export const TYPES_OF_TRADE_TAB_VALUES = [
  'trading-inputs',
  'trading-operations',
  'trading-log',
  'trading-results',
  'trading-debug',
] as const;

export type TradeTabValue = (typeof TYPES_OF_TRADE_TAB_VALUES)[number];
