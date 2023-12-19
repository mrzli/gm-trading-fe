import { TradingInputs } from './trading-inputs';
import { TickerDataRows } from '../../../../../types';

export interface TradingDataAndInputs {
  readonly barData: TickerDataRows;
  readonly barIndex: number;
  readonly inputs: TradingInputs;
}
