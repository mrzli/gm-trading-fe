import { TradeProcessState } from '../shared';
import { TradeLogEntryAny } from './trade-log-entry';

export interface ProcessTradeSequenceResult {
  readonly state: TradeProcessState;
  readonly tradeLog: TradeLogEntryAny[];
}
