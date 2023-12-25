import {
  CookieWrapper,
  createCookieWrapper,
  createLocalStorageWrapper,
  createSessionStorageWrapper,
  StorageWrapper,
} from '@gmjs/browser-storage';
import { AppConfig } from './app-config';
import { createServer } from './server';
import { AppApi, createAppApi } from '../api';

export interface AppDependencies {
  readonly api: AppApi;
  readonly cookie: CookieWrapper<string>;
  readonly localStorage: StorageWrapper<string>;
  readonly sessionStorage: StorageWrapper<string>;
}

export function createAppDependencies(config: AppConfig): AppDependencies {
  const server = createServer(config);
  const api = createAppApi(server);
  const cookie = createCookieWrapper();
  const localStorage = createLocalStorageWrapper();
  const sessionStorage = createSessionStorageWrapper();

  return {
    api,
    cookie,
    localStorage,
    sessionStorage,
  };
}
