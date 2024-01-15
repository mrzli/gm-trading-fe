import { TradeLine } from "../../../types";

export type SetTradeLinesFn = (tradeLines: readonly TradeLine[]) => void;

export interface TwPluginsApi {
  readonly setTradeLines: SetTradeLinesFn;
}
