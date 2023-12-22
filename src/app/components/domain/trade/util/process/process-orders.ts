import { ActiveOrder, TradeProcessState } from '../../types';

export function processOrders(
  state: TradeProcessState,
  index: number,
): TradeProcessState {
  let currentState = state;

  const { activeOrders } = currentState;

  const ordersToRemove = new Set<number>();

  for (const order of activeOrders) {
    currentState = processOrder(currentState, index, order, ordersToRemove);
  }

  return currentState;
}

function processOrder(
  state: TradeProcessState,
  index: number,
  order: ActiveOrder,
  ordersToRemove: Set<number>,
): TradeProcessState {
  // TODO
  // if order has no price, fill immediately with the open price of the current bar
  // if order has a price
  //   - if the order time is less than the current bar time
  //     - compare open of current bar with the close price of the previous bar
  //     - if the order price is between (inclusive), fill at open of current bar
  //   - if not filled by previous check
  //     - check if the order price is between (inclusive) the high and low of the current bar
  //     - if so, fill at the order price
  // if order is filled
  //   - add to active trade
  //   - add to trade log
  //   - schedule for removal from active orders

  return state;
}
