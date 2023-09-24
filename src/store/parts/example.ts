import { StoreApi, createStore } from 'zustand';
import type { AppDependencies } from '../../app-setup';

export interface StateExamplePlain {
  readonly isLoadingExample: boolean;
  readonly example: string | undefined;
}

export type StateExample = StateExamplePlain & {
  readonly getExample: () => void;
};

const INITIAL_STATE: StateExamplePlain = {
  isLoadingExample: false,
  example: undefined,
};

export type StoreExample = StoreApi<StateExample>;

export function createStoreExample(
  dependencies: AppDependencies,
): StoreExample {
  return createStore<StateExample>((setState, _getState, _store) => ({
    ...INITIAL_STATE,
    getExample(): void {
      (async (): Promise<void> => {
        setState({ isLoadingExample: true });
        try {
          const data = await dependencies.api.example.getExample();
          // artificial delay
          setTimeout(() => {
            setState({ isLoadingExample: false, example: data });
          }, 2000);
        } catch {
          setState({ isLoadingExample: false });
        }
      })();
    },
  }));
}
