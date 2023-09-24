import { StoreApi } from 'zustand';
import { AppState } from './app-state';

export type AppStoreApi = {
  readonly [TKey in keyof AppState]: StoreApi<AppState[TKey]>;
};
