import { ActiveTrade, TradeProcessState } from '../../types';

export function processTrades(
  state: TradeProcessState,
  index: number,
): TradeProcessState {
  let currentState = state;

  const { activeTrades } = currentState;

  const tradesToRemove = new Set<number>();

  for (const trade of activeTrades) {
    currentState = processTrade(currentState, index, trade, tradesToRemove);
  }

  return currentState;
}

function processTrade(
  state: TradeProcessState,
  index: number,
  order: ActiveTrade,
  tradesToRemove: Set<number>,
): TradeProcessState {
  // check if stop loss or limit is hit
  //   - if open is outside of stop loss or limit
  //     - close at open price
  //   - assume following price movement
  //     - if bar is bullish, assume movement from open to low to high to close
  //     - if bar is bearish, assume movement from open to high to low to close
  //   - if stop loss or limit is hit (not at open)
  //     - close at stop loss or limit price
  // if stop-loss or limit is hit
  //   - add to completed trades
  //   - add to trade log
  //   - schedule for removal from active trades

  return state;
}
