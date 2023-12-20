export const TYPES_OF_TRADE_TAB_VALUES = [
  'trading-inputs',
  'trading-display',
  'trading-log',
  'trading-results',
] as const;

export type TradeTabValue = (typeof TYPES_OF_TRADE_TAB_VALUES)[number];
