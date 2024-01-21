import {
  ManualTradeActionAny,
  TradingParameters,
} from '@gmjs/gm-trading-shared';

export interface TradingInputs {
  readonly params: TradingParameters;
  readonly manualTradeActions: readonly ManualTradeActionAny[];
}
