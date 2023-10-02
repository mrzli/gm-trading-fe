import { StoreApi, createStore } from 'zustand';
import { Instrument } from '@gmjs/gm-trading-shared';
import { AppDependencies } from '../../app-setup';

export interface StateInstrumentPlain {
  readonly isLoadingAllInstruments: boolean;
  readonly allInstruments: readonly Instrument[] | undefined;
}

export type StateInstrument = StateInstrumentPlain & {
  readonly getAllInstruments: () => void;
};

const INITIAL_STATE: StateInstrumentPlain = {
  isLoadingAllInstruments: false,
  allInstruments: undefined,
};

export type StoreInstrument = StoreApi<StateInstrument>;

export function createStoreInstrument(
  dependencies: AppDependencies,
): StoreInstrument {
  return createStore<StateInstrument>((setState, _getState, _store) => ({
    ...INITIAL_STATE,
    getAllInstruments(): void {
      (async (): Promise<void> => {
        setState({ isLoadingAllInstruments: true });
        try {
          const data = await dependencies.api.instrument.getAllInstruments();
          setState({ isLoadingAllInstruments: false, allInstruments: data });
        } catch {
          setState({ isLoadingAllInstruments: false });
        }
      })();
    },
  }));
}
