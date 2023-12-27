export const KINDS_OF_TRADE_LOG_ENTRIES = [
  'create-order',
  'cancel-order',
  'close-trade',
  'adjust-order',
  'adjust-trade',
  'fill-order',
  'stop-loss',
  'limit',
] as const;

export type TradeLogEntryKind = (typeof KINDS_OF_TRADE_LOG_ENTRIES)[number];

export interface TradeLogEntryBase {
  readonly kind: TradeLogEntryKind;
  readonly time: number;
}

export interface TradeLogEntryCreateOrder extends TradeLogEntryBase {
  readonly kind: 'create-order';
  readonly orderId: number;
  readonly price: number | undefined;
  readonly amount: number;
  readonly stopLossDistance: number;
  readonly limitDistance: number;
}

export interface TradeLogEntryCancelOrder extends TradeLogEntryBase {
  readonly kind: 'cancel-order';
  readonly orderId: number;
}

export interface TradeLogEntryCloseTrade extends TradeLogEntryBase {
  readonly kind: 'close-trade';
  readonly tradeId: number;
  readonly price: number;
}

export interface TradeLogEntryAdjustOrder extends TradeLogEntryBase {
  readonly kind: 'adjust-order';
  readonly orderId: number;
  readonly price: number | undefined;
  readonly amount: number;
  readonly stopLossDistance: number;
  readonly limitDistance: number;
}

export interface TradeLogEntryAdjustTrade extends TradeLogEntryBase {
  readonly kind: 'adjust-trade';
  readonly tradeId: number;
  readonly stopLoss: number;
  readonly limit: number;
}

// automatic
export interface TradeLogEntryFillOrder extends TradeLogEntryBase {
  readonly kind: 'fill-order';
  readonly orderId: number;
  readonly tradeId: number;
  readonly price: number;
  readonly stopLoss: number;
  readonly limit: number;
}

// automatic
export interface TradeLogEntryStopLoss extends TradeLogEntryBase {
  readonly kind: 'stop-loss';
  readonly tradeId: number;
  readonly price: number;
}

// automatic
export interface TradeLogEntryLimit extends TradeLogEntryBase {
  readonly kind: 'limit';
  readonly tradeId: number;
  readonly price: number;
}

export type TradeLogEntryAny =
  | TradeLogEntryCreateOrder
  | TradeLogEntryCancelOrder
  | TradeLogEntryCloseTrade
  | TradeLogEntryAdjustOrder
  | TradeLogEntryAdjustTrade
  | TradeLogEntryFillOrder
  | TradeLogEntryStopLoss
  | TradeLogEntryLimit;
