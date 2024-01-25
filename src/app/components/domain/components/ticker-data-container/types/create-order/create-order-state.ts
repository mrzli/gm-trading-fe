import { TradeDirection } from "../../../trade/types";

export type CreateOrderStateType =
  | 'start'
  | 'direction'
  | 'price'
  | 'stop-loss'
  | 'limit'
  | 'finish';

export type CreateOrderLimitOrMarket = 'limit' | 'market';

export interface CreateOrderStateBase {
  readonly type: CreateOrderStateType;
}

export interface CreateOrderStateStart extends CreateOrderStateBase {
  readonly type: 'start';
}

export interface CreateOrderStateDirection extends CreateOrderStateBase {
  readonly type: 'direction';
  readonly limitOrMarket: CreateOrderLimitOrMarket;
}

export interface CreateOrderStatePrice extends CreateOrderStateBase {
  readonly type: 'price';
  readonly limitOrMarket: CreateOrderLimitOrMarket;
  readonly direction: TradeDirection;
}

export interface CreateOrderStateStopLoss extends CreateOrderStateBase {
  readonly type: 'stop-loss';
  readonly limitOrMarket: CreateOrderLimitOrMarket;
  readonly direction: TradeDirection;
  readonly price: number | undefined;
}

export interface CreateOrderStateLimit extends CreateOrderStateBase {
  readonly type: 'limit';
  readonly limitOrMarket: CreateOrderLimitOrMarket;
  readonly direction: TradeDirection;
  readonly price: number | undefined;
  readonly stopLossDistance: number | undefined;
}

export interface CreateOrderStateFinish extends CreateOrderStateBase {
  readonly type: 'finish';
  readonly limitOrMarket: CreateOrderLimitOrMarket;
  readonly direction: TradeDirection;
  readonly price: number | undefined;
  readonly stopLossDistance: number | undefined;
  readonly limitDistance: number | undefined;
}

export type CreateOrderStateAny =
  | CreateOrderStateStart
  | CreateOrderStateDirection
  | CreateOrderStatePrice
  | CreateOrderStateStopLoss
  | CreateOrderStateLimit
  | CreateOrderStateFinish;
