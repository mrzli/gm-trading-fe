import { ensureNever } from '@gmjs/assert';
import { CreateOrderActionAny, CreateOrderStateAny } from '../types';

export function transitionCreateOrderState(
  state: CreateOrderStateAny,
  marketPrice: number,
  action: CreateOrderActionAny,
): CreateOrderStateAny {
  const type = action.type;
  const stateType = state.type;

  switch (type) {
    case 'order-limit': {
      return stateType === 'start'
        ? {
            type: 'direction',
            limitOrMarket: 'limit',
          }
        : state;
    }
    case 'order-market': {
      return stateType === 'start'
        ? {
            type: 'direction',
            limitOrMarket: 'market',
          }
        : state;
    }
    case 'buy':
    case 'sell': {
      if (stateType === 'direction') {
        if (state.limitOrMarket === 'limit') {
          return {
            type: 'price',
            limitOrMarket: state.limitOrMarket,
            direction: type,
          };
        } else if (state.limitOrMarket === 'market') {
          return {
            type: 'stop-loss',
            limitOrMarket: state.limitOrMarket,
            direction: type,
            price: undefined,
          };
        } else {
          return ensureNever(state.limitOrMarket);
        }
      } else {
        return state;
      }
    }
    case 'next-price': {
      if (
        stateType === 'price' ||
        stateType === 'stop-loss' ||
        stateType === 'limit'
      ) {
        const isBuy = state.direction === 'buy';

        switch (stateType) {
          case 'price': {
            return {
              type: 'stop-loss',
              limitOrMarket: state.limitOrMarket,
              direction: state.direction,
              price: action.price,
            };
          }
          case 'stop-loss': {
            const currentPrice = state.price ?? marketPrice;
            if (
              (isBuy && action.price >= currentPrice) ||
              (!isBuy && action.price <= currentPrice)
            ) {
              return state;
            }

            return {
              type: 'limit',
              limitOrMarket: state.limitOrMarket,
              direction: state.direction,
              price: state.price,
              stopLossDistance: Math.abs(currentPrice - action.price),
            };
          }
          case 'limit': {
            const currentPrice = state.price ?? marketPrice;
            if (
              (isBuy && action.price <= currentPrice) ||
              (!isBuy && action.price >= currentPrice)
            ) {
              return state;
            }

            return {
              type: 'finish',
              limitOrMarket: state.limitOrMarket,
              direction: state.direction,
              price: state.price,
              stopLossDistance: state.stopLossDistance,
              limitDistance: Math.abs(action.price - currentPrice),
            };
          }
          default: {
            return ensureNever(stateType);
          }
        }
      } else {
        return state;
      }
    }
    case 'finish': {
      return stateType === 'finish'
        ? {
            type: 'start',
          }
        : state;
    }
    case 'skip': {
      if (stateType === 'stop-loss' || stateType === 'limit') {
        switch (stateType) {
          case 'stop-loss': {
            return {
              type: 'limit',
              limitOrMarket: state.limitOrMarket,
              direction: state.direction,
              price: state.price,
              stopLossDistance: undefined,
            };
          }
          case 'limit': {
            return {
              type: 'finish',
              limitOrMarket: state.limitOrMarket,
              direction: state.direction,
              price: state.price,
              stopLossDistance: state.stopLossDistance,
              limitDistance: undefined,
            };
          }
          default: {
            return ensureNever(stateType);
          }
        }
      } else {
        return state;
      }
    }
    case 'cancel': {
      return {
        type: 'start',
      };
    }
    default: {
      return ensureNever(action);
    }
  }
}

// function invariantExpectState<TState extends CreateOrderStateType>(
//   state: CreateOrderStateType,
//   states: readonly TState[],
// ): asserts state is TState {
//   invariant(
//     states.includes(state as TState),
//     `Expected state to be one of [${states
//       .map((s) => `'${s}'`)
//       .join(', ')}], but got '${state}'`,
//   );
// }
