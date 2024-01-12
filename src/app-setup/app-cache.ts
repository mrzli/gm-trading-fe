import {
  TickerDataCache,
  createTickerDataCache,
} from './cache';

export interface AppCache {
  readonly tickerData: TickerDataCache;
}

export function createAppCache(): AppCache {
  return {
    tickerData: createTickerDataCache(),
  };
}
