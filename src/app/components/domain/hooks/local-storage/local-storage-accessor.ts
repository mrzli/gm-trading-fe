import { useMemo } from 'react';
import { useLocalStorage } from './local-storage';
import { LocalStorageKeys } from '../../../../../app-setup/dependencies';
import { StorageWrapper } from '@gmjs/browser-storage';

export type UseStorageValueAccessorResult<TValue> = readonly [
  getValue: () => TValue | undefined,
  setValue: (value: TValue | undefined) => void,
];

export function useLocalStorageAccessor<K extends LocalStorageKeys, TValue>(
  key: K,
): UseStorageValueAccessorResult<TValue> {
  const localStorage = useLocalStorage();
  return useStorageValueAccessor(localStorage, key);
}

function useStorageValueAccessor<
  TStorageKeys extends string,
  TKey extends TStorageKeys,
  TValue,
>(
  storage: StorageWrapper<TStorageKeys>,
  key: TKey,
): UseStorageValueAccessorResult<TValue> {
  const { getValue, setValue } = useMemo(
    () => getStorageValueAccessor<TStorageKeys, TKey, TValue>(storage, key),
    [storage, key],
  );

  return [getValue, setValue];
}

interface StorageValueAccessor<TValue> {
  readonly getValue: () => TValue | undefined;
  readonly setValue: (value: TValue | undefined) => void;
}

function getStorageValueAccessor<
  TStorageKeys extends string,
  TKey extends TStorageKeys,
  TValue,
>(
  storage: StorageWrapper<TStorageKeys>,
  key: TKey,
): StorageValueAccessor<TValue> {
  const getValue = (): TValue | undefined => {
    const valueRaw = storage.get(key);
    const value = valueRaw === undefined ? undefined : JSON.parse(valueRaw);
    return value;
  };

  const setValue = (tradingInputs: TValue | undefined): void => {
    if (tradingInputs === undefined) {
      storage.remove(key);
    } else {
      storage.set(key, JSON.stringify(tradingInputs));
    }
  };

  return {
    getValue,
    setValue,
  };
}
