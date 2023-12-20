import { TradingInputs } from './trading-inputs';
import { TradingChartData } from '..';

export interface TradingDataAndInputs {
  readonly chartData: TradingChartData;
  readonly inputs: TradingInputs;
}
