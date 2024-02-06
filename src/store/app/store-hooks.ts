import { useContext } from 'react';
import { useStore } from 'zustand';
import { AppContext } from '../../app-setup';
import { AppStoreApi } from './app-store-api';
import {
  StateExample,
  StateInstrument,
  StateStrategy,
  StateTickerData,
  StateTrade,
} from '../parts';

function useAppStore(): AppStoreApi {
  return useContext(AppContext).store;
}

export function useStoreExample(): StateExample {
  const store = useAppStore();
  return useStore(store.example);
}

export function useStoreInstrument(): StateInstrument {
  const store = useAppStore();
  return useStore(store.instrument);
}

export function useStoreStrategy(): StateStrategy {
  const store = useAppStore();
  return useStore(store.strategy);
}

export function useStoreTickerData(): StateTickerData {
  const store = useAppStore();
  return useStore(store.tickerData);
}

export function useStoreTrade(): StateTrade {
  const store = useAppStore();
  return useStore(store.trade);
}
