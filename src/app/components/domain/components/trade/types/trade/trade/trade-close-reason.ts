export const TYPES_OF_TRADE_CLOSE_REASONS = [
  'manual',
  'stop-loss',
  'limit',
] as const;

export type TradeCloseReason = (typeof TYPES_OF_TRADE_CLOSE_REASONS)[number];
