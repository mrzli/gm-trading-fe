import { TradesCollection } from '@gmjs/gm-trading-shared';
import { TradeLogEntryAny } from './trade-log-entry';

export interface ProcessTradeSequenceResult {
  readonly tradesCollection: TradesCollection;
  readonly tradeLog: TradeLogEntryAny[];
}
