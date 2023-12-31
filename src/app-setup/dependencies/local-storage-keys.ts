export const LOCAL_STORAGE_KEYS = [
  'trading-inputs',
  'trading-ui-state',
] as const;

export type LocalStorageKeys = (typeof LOCAL_STORAGE_KEYS)[number];
