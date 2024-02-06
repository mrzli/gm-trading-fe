import type { AppDependencies } from '../../app-setup';
import {
  createStoreExample,
  createStoreInstrument,
  createStoreStrategy,
  createStoreTickerData,
  createStoreTrade,
} from '../parts';
import { AppStoreApi } from './app-store-api';

export function createAppStore(dependencies: AppDependencies): AppStoreApi {
  return {
    example: createStoreExample(dependencies),
    instrument: createStoreInstrument(dependencies),
    strategy: createStoreStrategy(dependencies),
    tickerData: createStoreTickerData(dependencies),
    trade: createStoreTrade(dependencies),
  };
}
