import { TradingInputs } from './trading-inputs';
import { BarReplayPosition, Bars, ChartSettings } from '../../../../../types';
import { FullBarData } from '../../../../ticker-data-container/types';
import { Instrument } from '@gmjs/gm-trading-shared';

export interface TradingDataAndInputs {
  readonly settings: ChartSettings;
  readonly instrument: Instrument;
  readonly fullData: FullBarData;
  readonly replayPosition: BarReplayPosition;
  readonly barData: Bars;
  readonly barIndex: number;
  readonly inputs: TradingInputs;
}
