import { TradingInputs } from './trading-inputs';
import { BarReplayPosition, Bars, ChartSettings } from '../../../../../types';
import { FullBarData } from '../../../../ticker-data-container/types';

export interface TradingDataAndInputs {
  readonly settings: ChartSettings;
  readonly fullData: FullBarData;
  readonly replayPosition: BarReplayPosition;
  readonly barData: Bars;
  readonly barIndex: number;
  readonly inputs: TradingInputs;
}
