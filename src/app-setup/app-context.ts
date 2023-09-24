import React from 'react';
import { AppDependencies } from './app-dependencies';
import { AppGlobals } from './app-globals';
import { AppStoreApi } from '../store';

export interface AppContextData {
  readonly globals: AppGlobals;
  readonly store: AppStoreApi;
  readonly dependencies: AppDependencies;
}

export function createAppContext(
  globals: AppGlobals,
  store: AppStoreApi,
  dependencies: AppDependencies,
): AppContextData {
  return {
    globals,
    store,
    dependencies,
  };
}

// const APP_CONTEXT: AppContextData = {
//   dependencies: createAppDependencies(axios),
// };

export const AppContext = React.createContext<AppContextData>(
  // app context should never be used outside of wrapper component, so this should not be an issue
  undefined as unknown as AppContextData,
);
