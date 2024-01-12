import { TickerDataResponse, TickerDataSource } from '@gmjs/gm-trading-shared';

// const MAX_CACHE_SIZE = 10_000_000;

export interface TickerDataCacheKeyObject {
  readonly source: TickerDataSource;
  readonly instrument: string;
  readonly resolution: string;
}

function toCacheKeyString(key: TickerDataCacheKeyObject): string {
  return `${key.source}:${key.instrument}:${key.resolution}`;
}

export interface TickerDataCacheData {
  cacheSize: number;
  readonly dataMap: Map<string, TickerDataResponse>;
}

export interface TickerDataCache {
  readonly get: (
    key: TickerDataCacheKeyObject,
  ) => TickerDataResponse | undefined;
  readonly set: (
    key: TickerDataCacheKeyObject,
    data: TickerDataResponse,
  ) => void;
  readonly clear: () => void;
}

export function createTickerDataCache(): TickerDataCache {
  const cacheData: TickerDataCacheData = {
    cacheSize: 0,
    dataMap: new Map(),
  };

  return {
    get(key: TickerDataCacheKeyObject): TickerDataResponse | undefined {
      return getFromTickerDataCache(cacheData, key);
    },
    set(key: TickerDataCacheKeyObject, data: TickerDataResponse): void {
      addToTickerDataCache(cacheData, key, data);
    },
    clear(): void {
      clearCache(cacheData);
    },
  };
}

function addToTickerDataCache(
  cacheData: TickerDataCacheData,
  keyObject: TickerDataCacheKeyObject,
  data: TickerDataResponse,
): void {
  const key = toCacheKeyString(keyObject);
  const dataMap = cacheData.dataMap;
  const existingData = dataMap.get(key);
  if (existingData) {
    const existingDataSize = existingData.data.length;
    dataMap.set(key, data);
    cacheData.cacheSize += data.data.length - existingDataSize;
  } else {
    dataMap.set(key, data);
    cacheData.cacheSize += data.data.length;
  }
}

export function getFromTickerDataCache(
  cacheData: TickerDataCacheData,
  keyObject: TickerDataCacheKeyObject,
): TickerDataResponse | undefined {
  const key = toCacheKeyString(keyObject);
  return cacheData.dataMap.get(key);
}

export function clearCache(cacheData: TickerDataCacheData): void {
  cacheData.dataMap.clear();
  cacheData.cacheSize = 0;
}
