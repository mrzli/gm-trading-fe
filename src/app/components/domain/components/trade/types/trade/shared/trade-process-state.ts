import {
  ActiveOrder,
  ActiveTrade,
  CompletedTrade,
  ManualTradeActionAny,
  TradingParameters,
} from '@gmjs/gm-trading-shared';
import { Bars } from '../../../../../types';
import { TradeLogEntryAny } from '../trade';

export interface TradeProcessState {
  readonly barData: Bars;
  readonly barIndex: number;
  readonly tradingParams: TradingParameters;
  readonly manualTradeActionsByBar: ReadonlyMap<
    number,
    readonly ManualTradeActionAny[]
  >;
  readonly activeOrders: readonly ActiveOrder[];
  readonly activeTrades: readonly ActiveTrade[];
  readonly completedTrades: readonly CompletedTrade[];
  readonly tradeLog: readonly TradeLogEntryAny[];
}
