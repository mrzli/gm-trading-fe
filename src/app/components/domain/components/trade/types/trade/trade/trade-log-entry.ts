export const KINDS_OF_TRADE_LOG_ENTRIES = [
  'create-order',
  'cancel-order',
  'close-trade',
  'amend-order',
  'amend-trade',
  'fill-order',
  'stop-loss',
  'limit',
] as const;

export type TradeLogEntryKind = (typeof KINDS_OF_TRADE_LOG_ENTRIES)[number];

export interface TradeLogEntryBase {
  readonly kind: TradeLogEntryKind;
  readonly time: number;
  readonly barIndex: number;
}

export interface TradeLogEntryCreateOrder extends TradeLogEntryBase {
  readonly kind: 'create-order';
  readonly orderId: number;
  readonly price: number | undefined;
  readonly amount: number;
  readonly stopLossDistance: number | undefined;
  readonly limitDistance: number | undefined;
}

export interface TradeLogEntryAmendOrder extends TradeLogEntryBase {
  readonly kind: 'amend-order';
  readonly orderId: number;
  readonly price: number | undefined;
  readonly amount: number;
  readonly stopLossDistance: number | undefined;
  readonly limitDistance: number | undefined;
}

export interface TradeLogEntryFillOrder extends TradeLogEntryBase {
  readonly kind: 'fill-order';
  readonly orderId: number;
  readonly tradeId: number;
  readonly price: number;
  readonly stopLoss: number | undefined;
  readonly limit: number | undefined;
}

export interface TradeLogEntryCancelOrder extends TradeLogEntryBase {
  readonly kind: 'cancel-order';
  readonly orderId: number;
}

export interface TradeLogEntryAmendTrade extends TradeLogEntryBase {
  readonly kind: 'amend-trade';
  readonly tradeId: number;
  readonly stopLoss: number | undefined;
  readonly limit: number | undefined;
}

export interface TradeLogEntryStopLoss extends TradeLogEntryBase {
  readonly kind: 'stop-loss';
  readonly tradeId: number;
  readonly price: number;
}

export interface TradeLogEntryLimit extends TradeLogEntryBase {
  readonly kind: 'limit';
  readonly tradeId: number;
  readonly price: number;
}

export interface TradeLogEntryCloseTrade extends TradeLogEntryBase {
  readonly kind: 'close-trade';
  readonly tradeId: number;
  readonly price: number;
}

export type TradeLogEntryAny =
  | TradeLogEntryCreateOrder
  | TradeLogEntryAmendOrder
  | TradeLogEntryFillOrder
  | TradeLogEntryCancelOrder
  | TradeLogEntryAmendTrade
  | TradeLogEntryStopLoss
  | TradeLogEntryLimit
  | TradeLogEntryCloseTrade;
