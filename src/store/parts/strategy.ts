import { StoreApi, createStore } from 'zustand';
import {
  RunStrategyRequest,
  RunStrategyResponse,
} from '@gmjs/gm-trading-shared';
import { AppDependencies } from '../../app-setup';

export interface StateStrategyPlain {
  readonly isRunningStrategy: boolean;
  readonly runStrategyData: RunStrategyResponse | undefined;
}

export type StateStrategy = StateStrategyPlain & {
  readonly runStrategy: (input: RunStrategyRequest) => void;
};

const INITIAL_STATE: StateStrategyPlain = {
  isRunningStrategy: false,
  runStrategyData: undefined,
};

export type StoreStrategy = StoreApi<StateStrategy>;

export function createStoreStrategy(
  dependencies: AppDependencies,
): StoreStrategy {
  return createStore<StateStrategy>((setState, _getState, _store) => ({
    ...INITIAL_STATE,
    runStrategy(input: RunStrategyRequest): void {
      (async (): Promise<void> => {
        setState({ isRunningStrategy: true });
        try {
          const data = await dependencies.api.strategy.runStrategy(input);
          setState({ isRunningStrategy: false, runStrategyData: data });
        } catch {
          setState({ isRunningStrategy: false });
        }
      })();
    },
  }));
}
