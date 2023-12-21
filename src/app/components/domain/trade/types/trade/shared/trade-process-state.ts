import { TickerDataRows } from '../../../../../../types';
import { ManualTradeActionAny } from '../inputs';
import {
  ActiveOrder,
  ActiveTrade,
  CompletedTrade,
  TradeLogEntryAny,
} from '../trade';

export interface TradeProcessState {
  readonly barData: TickerDataRows;
  readonly barIndex: number;
  readonly remainingManualActions: readonly ManualTradeActionAny[];
  readonly activeOrders: readonly ActiveOrder[];
  readonly activeTrades: readonly ActiveTrade[];
  readonly completedTrades: readonly CompletedTrade[];
  readonly tradeLog: readonly TradeLogEntryAny[];
}
