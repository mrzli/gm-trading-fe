import { AppConfig } from './app-config';

export interface AppGlobals {
  readonly config: AppConfig;
}

export function createAppGlobals(config: AppConfig): AppGlobals {
  return {
    config,
  };
}
