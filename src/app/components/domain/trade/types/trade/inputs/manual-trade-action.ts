export const KINDS_OF_MANUAL_TRADE_ACTIONS = [
  'open',
  'close',
  'amend-order',
  'amend-trade',
] as const;

export type ManualTradeActionKind =
  (typeof KINDS_OF_MANUAL_TRADE_ACTIONS)[number];

export interface ManualTradeActionBase {
  readonly kind: ManualTradeActionKind;
  readonly id: number;
  readonly time: number;
}

export interface ManualTradeActionOpen extends ManualTradeActionBase {
  readonly kind: 'open';
  readonly price: number | undefined;
  readonly amount: number;
  readonly stopLossDistance: number | undefined;
  readonly limitDistance: number | undefined;
}

export interface ManualTradeActionClose extends ManualTradeActionBase {
  readonly kind: 'close';
  readonly targetId: number;
}

export interface ManualTradeActionAmendOrder extends ManualTradeActionBase {
  readonly kind: 'amend-order';
  readonly targetId: number;
  readonly price: number | undefined;
  readonly amount: number;
  readonly stopLossDistance: number | undefined;
  readonly limitDistance: number | undefined;
}

export interface ManualTradeActionAmendTrade extends ManualTradeActionBase {
  readonly kind: 'amend-trade';
  readonly targetId: number;
  readonly stopLoss: number | undefined;
  readonly limit: number | undefined;
}

export type ManualTradeActionAny =
  | ManualTradeActionOpen
  | ManualTradeActionClose
  | ManualTradeActionAmendOrder
  | ManualTradeActionAmendTrade;
