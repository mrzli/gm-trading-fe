export interface ActiveOrder {
  readonly id: number;
  readonly time: number;
  readonly price: number | undefined;
  readonly amount: number;
  readonly stopLossDistance: number | undefined;
  readonly limitDistance: number | undefined;
}
