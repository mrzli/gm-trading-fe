import { TickerDataRows } from '../../../../../../types';
import { ManualTradeActionAny } from '../inputs';
import { TradeResult } from '../result';

export interface TradeProcessState {
  readonly barData: TickerDataRows;
  readonly barIndex: number;
  readonly remainingTradeActions: readonly ManualTradeActionAny[];
  readonly tradeResult: TradeResult;
}
