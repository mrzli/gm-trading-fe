import { useContext } from 'react';
import { useStore } from 'zustand';
import { AppContext } from '../../app-setup';
import { AppStoreApi } from './app-store-api';
import { StateExample } from '../parts';

function useAppStore(): AppStoreApi {
  return useContext(AppContext).store;
}

export function useStoreExample(): StateExample {
  const store = useAppStore();
  return useStore(store.example);
}
