import { TradeLine } from './trade-line';

export type SetTradeLinesFn = (tradeLines: readonly TradeLine[]) => void;

export interface TwPluginsApi {
  readonly setTradeLines: SetTradeLinesFn;
}
