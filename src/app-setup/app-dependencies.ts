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
import { LocalStorageKeys } from './dependencies';
import { AppCache, createAppCache } from './cache';

export interface AppDependencies {
  readonly api: AppApi;
  readonly cookie: CookieWrapper<string>;
  readonly localStorage: StorageWrapper<LocalStorageKeys>;
  readonly sessionStorage: StorageWrapper<string>;
  readonly cache: AppCache;
}

export function createAppDependencies(config: AppConfig): AppDependencies {
  const server = createServer(config);
  const api = createAppApi(server);
  const cookie = createCookieWrapper();
  const localStorage = createLocalStorageWrapper();
  const sessionStorage = createSessionStorageWrapper();
  const cache = createAppCache();

  return {
    api,
    cookie,
    localStorage,
    sessionStorage,
    cache,
  };
}
