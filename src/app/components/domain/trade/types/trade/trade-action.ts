export const KINDS_OF_TRADE_ACTIONS = [
  'create-order',
  'cancel-order',
  'close-trade',
  'adjust-order',
  'adjust-trade',
  'fill-order',
  'stop-loss',
  'limit',
] as const;

export type TradeActionKind = (typeof KINDS_OF_TRADE_ACTIONS)[number];

export interface TradeActionBase {
  readonly kind: TradeActionKind;
  readonly time: number;
}

export interface TradeActionCreateOrder extends TradeActionBase {
  readonly kind: 'create-order';
  readonly orderId: number;
  readonly price: number | undefined;
  readonly amount: number;
  readonly stopLossDistance: number;
  readonly limitDistance: number;
}

export interface TradeActionCancelOrder extends TradeActionBase {
  readonly kind: 'cancel-order';
  readonly orderId: number;
}

export interface TradeActionCloseTrade extends TradeActionBase {
  readonly kind: 'close-trade';
  readonly tradeId: number;
  readonly price: number;
}

export interface TradeActionAdjustOrder extends TradeActionBase {
  readonly kind: 'adjust-order';
  readonly orderId: number;
  readonly price: number | undefined;
  readonly amount: number;
  readonly stopLossDistance: number;
  readonly limitDistance: number;
}

export interface TradeActionAdjustTrade extends TradeActionBase {
  readonly kind: 'adjust-trade';
  readonly tradeId: number;
  readonly stopLoss: number;
  readonly limit: number;
}

// automatic
export interface TradeActionFillOrder extends TradeActionBase {
  readonly kind: 'fill-order';
  readonly orderId: number;
  readonly tradeId: number;
  readonly price: number;
  readonly stopLoss: number;
  readonly limit: number;
}

// automatic
export interface TradeActionStopLoss extends TradeActionBase {
  readonly kind: 'stop-loss';
  readonly tradeId: number;
  readonly price: number;
}

// automatic
export interface TradeActionLimit extends TradeActionBase {
  readonly kind: 'limit';
  readonly tradeId: number;
  readonly price: number;
}

export type TradeActionManual =
  | TradeActionCreateOrder
  | TradeActionCancelOrder
  | TradeActionCloseTrade
  | TradeActionAdjustOrder
  | TradeActionAdjustTrade;

export type TradeActionAutomatic =
  | TradeActionFillOrder
  | TradeActionStopLoss
  | TradeActionLimit;

export type TradeActionAny = TradeActionManual | TradeActionAutomatic;
