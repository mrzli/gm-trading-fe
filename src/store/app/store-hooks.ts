import { useContext } from 'react';
import { useStore } from 'zustand';
import { AppContext } from '../../app-setup';
import { AppStoreApi } from './app-store-api';
import { StateExample, StateInstrument, StateTickerData } from '../parts';

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

export function useStoreTickerData(): StateTickerData {
  const store = useAppStore();
  return useStore(store.tickerData);
}
