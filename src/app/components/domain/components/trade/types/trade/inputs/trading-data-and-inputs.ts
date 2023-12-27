import { TradingInputs } from './trading-inputs';
import { Bars, ChartSettings } from '../../../../../types';

export interface TradingDataAndInputs {
  readonly settings: ChartSettings;
  readonly barData: Bars;
  readonly barIndex: number;
  readonly inputs: TradingInputs;
}
