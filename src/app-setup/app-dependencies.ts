import { AppConfig } from './app-config';
import { createServer } from './server';
import { AppApi, createAppApi } from '../api';

export interface AppDependencies {
  readonly api: AppApi;
}

export function createAppDependencies(config: AppConfig): AppDependencies {
  const server = createServer(config);
  const api = createAppApi(server);

  return {
    api,
  };
}
