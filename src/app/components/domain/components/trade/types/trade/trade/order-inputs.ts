import { TradeDirection } from '../generic/trade-direction';

export interface OrderInputs {
  readonly direction: TradeDirection;
  readonly price: number | undefined;
  readonly amount: number;
  readonly stopLossDistance: number | undefined;
  readonly limitDistance: number | undefined;
}
