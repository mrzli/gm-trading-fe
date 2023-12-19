import { TradeActionManual } from './trade-action';
import { TradingParameters } from './trading-parameters';

export interface TradingInputs {
  readonly params: TradingParameters;
  readonly manualTradeActions: readonly TradeActionManual[];
}
