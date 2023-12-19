import { ManualTradeActionAny } from './manual-trade-action';
import { TradingParameters } from './trading-parameters';

export interface TradingInputs {
  readonly params: TradingParameters;
  readonly manualTradeActions: readonly ManualTradeActionAny[];
}
