import type { AppDependencies } from '../../app-setup';
import { createStoreExample, createStoreTickerData } from '../parts';
import { AppStoreApi } from './app-store-api';

export function createAppStore(dependencies: AppDependencies): AppStoreApi {
  return {
    example: createStoreExample(dependencies),
    tickerData: createStoreTickerData(dependencies),
  };
}
