import { ensureNever, invariant } from '@gmjs/assert';
import {
  CreateOrderActionAny,
  CreateOrderStateAny,
  CreateOrderStateType,
} from '../types';

export function transitionCreateOrderState(
  state: CreateOrderStateAny,
  action: CreateOrderActionAny,
): CreateOrderStateAny {
  const type = action.type;
  const stateType = state.type;

  switch (type) {
    case 'order-limit': {
      
      invariantExpectState<'start'>(stateType, ['start']);
      return {
        type: 'direction',
        limitOrMarket: 'limit',
      };
    }
    case 'order-market': {
      invariantExpectState<'start'>(stateType, ['start']);
      return {
        type: 'direction',
        limitOrMarket: 'market',
      };
    }
    case 'buy':
    case 'sell': {
      invariantExpectState<'direction'>(stateType, ['direction']);
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
    }
    case 'next-price': {
      invariantExpectState<'price' | 'stop-loss' | 'limit'>(stateType, [
        'price',
        'stop-loss',
        'limit',
      ]);
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
          return {
            type: 'limit',
            limitOrMarket: state.limitOrMarket,
            direction: state.direction,
            price: state.price,
            stopLoss: action.price,
          };
        }
        case 'limit': {
          return {
            type: 'finish',
            limitOrMarket: state.limitOrMarket,
            direction: state.direction,
            price: state.price,
            stopLoss: state.stopLoss,
            limit: action.price,
          };
        }
        default: {
          return ensureNever(stateType);
        }
      }
    }
    case 'finish': {
      invariantExpectState<'finish'>(stateType, ['finish']);
      return {
        type: 'start',
      };
    }
    case 'skip': {
      invariantExpectState<'stop-loss' | 'limit'>(stateType, [
        'stop-loss',
        'limit',
      ]);
      switch (stateType) {
        case 'stop-loss': {
          return {
            type: 'limit',
            limitOrMarket: state.limitOrMarket,
            direction: state.direction,
            price: state.price,
            stopLoss: undefined,
          };
        }
        case 'limit': {
          return {
            type: 'finish',
            limitOrMarket: state.limitOrMarket,
            direction: state.direction,
            price: state.price,
            stopLoss: state.stopLoss,
            limit: undefined,
          };
        }
        default: {
          return ensureNever(stateType);
        }
      }
    }
    case 'cancel': {
      invariantExpectState<
        'start' | 'direction' | 'price' | 'stop-loss' | 'limit' | 'finish'
      >(stateType, ['start']);
      return {
        type: 'start',
      };
    }
    default: {
      return ensureNever(action);
    }
  }
}

function invariantExpectState<TState extends CreateOrderStateType>(
  state: CreateOrderStateType,
  states: readonly TState[],
): asserts state is TState {
  invariant(
    states.includes(state as TState),
    `Expected state to be one of [${states
      .map((s) => `'${s}'`)
      .join(', ')}], but got '${state}'`,
  );
}
