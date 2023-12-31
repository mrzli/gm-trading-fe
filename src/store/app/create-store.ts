import type { AppDependencies } from '../../app-setup';
import {
  createStoreExample,
  createStoreInstrument,
  createStoreTickerData,
} from '../parts';
import { AppStoreApi } from './app-store-api';

export function createAppStore(dependencies: AppDependencies): AppStoreApi {
  return {
    example: createStoreExample(dependencies),
    instrument: createStoreInstrument(dependencies),
    tickerData: createStoreTickerData(dependencies),
  };
}
