export type CreateOrderActionType =
  | 'order-limit'
  | 'order-market'
  | 'buy'
  | 'sell'
  | 'next-price'
  | 'finish'
  | 'skip'
  | 'cancel';

export interface CreateOrderActionBase {
  readonly type: CreateOrderActionType;
}

export interface CreateOrderActionOrderLimit extends CreateOrderActionBase {
  readonly type: 'order-limit';
}

export interface CreateOrderActionOrderMarket extends CreateOrderActionBase {
  readonly type: 'order-market';
}

export interface CreateOrderActionBuy extends CreateOrderActionBase {
  readonly type: 'buy';
}

export interface CreateOrderActionSell extends CreateOrderActionBase {
  readonly type: 'sell';
}

export interface CreateOrderActionNextPrice extends CreateOrderActionBase {
  readonly type: 'next-price';
  readonly price: number;
}

export interface CreateOrderActionFinish extends CreateOrderActionBase {
  readonly type: 'finish';
}

export interface CreateOrderActionSkip extends CreateOrderActionBase {
  readonly type: 'skip';
}

export interface CreateOrderActionCancel extends CreateOrderActionBase {
  readonly type: 'cancel';
}

export type CreateOrderActionAny =
  | CreateOrderActionOrderLimit
  | CreateOrderActionOrderMarket
  | CreateOrderActionBuy
  | CreateOrderActionSell
  | CreateOrderActionNextPrice
  | CreateOrderActionFinish
  | CreateOrderActionSkip
  | CreateOrderActionCancel;
