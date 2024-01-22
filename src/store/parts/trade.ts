import { StoreApi, createStore } from 'zustand';
import { AppDependencies } from '../../app-setup';
import { TradeState } from '@gmjs/gm-trading-shared';

export interface StateTradePlain {
  readonly isLoadingTradeStates: boolean;
  readonly tradeStates: readonly TradeState[] | undefined;
  readonly isSavingTradeState: boolean;
}

export type StateTrade = StateTradePlain & {
  readonly getTradeStates: () => void;
  readonly saveTradeState: (tradeState: TradeState) => void;
};

const INITIAL_STATE: StateTradePlain = {
  isLoadingTradeStates: false,
  tradeStates: undefined,
  isSavingTradeState: false,
};

export type StoreTrade = StoreApi<StateTrade>;

export function createStoreTrade(dependencies: AppDependencies): StoreTrade {
  return createStore<StateTrade>((setState, _getState, _store) => ({
    ...INITIAL_STATE,
    getTradeStates(): void {
      (async (): Promise<void> => {
        setState({ isLoadingTradeStates: true });
        try {
          const data = await dependencies.api.trade.getTradeStates();
          setState({ isLoadingTradeStates: false, tradeStates: data });
        } catch {
          setState({ isLoadingTradeStates: false });
        }
      })();
    },
    saveTradeState(tradeState: TradeState): void {
      (async (): Promise<void> => {
        setState({ isSavingTradeState: true });
        try {
          await dependencies.api.trade.saveTradeState(tradeState);
          setState({ isSavingTradeState: false });
        } catch {
          setState({ isSavingTradeState: false });
        }
      })();
    },
  }));
}
