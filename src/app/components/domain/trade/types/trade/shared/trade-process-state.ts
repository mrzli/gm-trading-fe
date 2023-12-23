import { TickerDataRows } from '../../../../../../types';
import { ManualTradeActionAny, TradingParameters } from '../inputs';
import {
  ActiveOrder,
  ActiveTrade,
  CompletedTrade,
  TradeLogEntryAny,
} from '../trade';

export interface TradeProcessState {
  readonly barData: TickerDataRows;
  readonly barIndex: number;
  readonly tradingParams: TradingParameters;
  readonly remainingManualActions: readonly ManualTradeActionAny[];
  readonly activeOrders: readonly ActiveOrder[];
  readonly activeTrades: readonly ActiveTrade[];
  readonly completedTrades: readonly CompletedTrade[];
  readonly tradeLog: readonly TradeLogEntryAny[];
}
