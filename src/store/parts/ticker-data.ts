import { StoreApi, createStore } from 'zustand';
import { AppDependencies } from '../../app-setup';
import { TickerDataRequest, TickerDataResponse } from '@gmjs/gm-trading-shared';

export interface StateTickerDataPlain {
  readonly isLoadingTickerData: boolean;
  readonly tickerData: TickerDataResponse | undefined;
}

export type StateTickerData = StateTickerDataPlain & {
  readonly getTickerData: (data: TickerDataRequest) => void;
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
    getTickerData(input: TickerDataRequest): void {
      (async (): Promise<void> => {
        setState({ isLoadingTickerData: true });
        try {
          const data = await dependencies.api.tickerData.getTickerData(input);
          setState({ isLoadingTickerData: false, tickerData: data });
        } catch {
          setState({ isLoadingTickerData: false });
        }
      })();
    },
  }));
}
