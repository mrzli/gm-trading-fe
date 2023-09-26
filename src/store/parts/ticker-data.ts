import { StoreApi, createStore } from 'zustand';
import { AppDependencies } from '../../app-setup';

export interface StateTickerDataPlain {
  readonly isLoadingTickerData: boolean;
  readonly tickerData: readonly string[] | undefined;
}

export type StateTickerData = StateTickerDataPlain & {
  readonly getTickerData: () => void;
};

const INITIAL_STATE: StateTickerDataPlain = {
  isLoadingTickerData: false,
  tickerData: undefined,
};

export type StoreTickerData = StoreApi<StateTickerData>;

export function createStoreTickerData(
  dependencies: AppDependencies,
): StoreTickerData {
  return createStore<StateTickerData>((setState, _getState, _store) => ({
    ...INITIAL_STATE,
    getTickerData(): void {
      (async (): Promise<void> => {
        setState({ isLoadingTickerData: true });
        try {
          const data = await dependencies.api.tickerData.getTickerData();
          setState({ isLoadingTickerData: false, tickerData: data });
        } catch {
          setState({ isLoadingTickerData: false });
        }
      })();
    },
  }));
}
