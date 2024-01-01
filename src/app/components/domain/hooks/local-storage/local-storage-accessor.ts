import { useMemo } from 'react';
import { isFunction } from '@gmjs/type-checks';
import { StorageWrapper } from '@gmjs/browser-storage';
import { useLocalStorage } from './local-storage';
import { LocalStorageKeys } from '../../../../../app-setup/dependencies';

export type UseStorageValueAccessorResultGetValue<TValue> = () =>
  | TValue
  | undefined;

export type UseStorageValueAccessorResultSetValueFromPrev<TValue> = (
  prev: TValue | undefined,
) => TValue | undefined;

export type UseStorageValueAccessorResultSetValue<TValue> = (
  value:
    | TValue
    | undefined
    | UseStorageValueAccessorResultSetValueFromPrev<TValue>,
) => void;

export type UseStorageValueAccessorResult<TValue> = readonly [
  getValue: UseStorageValueAccessorResultGetValue<TValue>,
  setValue: UseStorageValueAccessorResultSetValue<TValue>,
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
  readonly getValue: UseStorageValueAccessorResultGetValue<TValue>;
  readonly setValue: UseStorageValueAccessorResultSetValue<TValue>;
}

function getStorageValueAccessor<
  TStorageKeys extends string,
  TKey extends TStorageKeys,
  TValue,
>(
  storage: StorageWrapper<TStorageKeys>,
  key: TKey,
): StorageValueAccessor<TValue> {
  const getValue: UseStorageValueAccessorResultGetValue<TValue> = () => {
    const valueRaw = storage.get(key);
    const value = valueRaw === undefined ? undefined : JSON.parse(valueRaw);
    return value;
  };

  const setValueInternal = (value: TValue | undefined): void => {
    if (value === undefined) {
      storage.remove(key);
    } else {
      storage.set(key, JSON.stringify(value));
    }
  };

  const setValue: UseStorageValueAccessorResultSetValue<TValue> = (value) => {
    const prev = getValue();
    const finalValue = isFunction<
      UseStorageValueAccessorResultSetValueFromPrev<TValue>
    >(value)
      ? value(prev)
      : value;
    setValueInternal(finalValue);
  };

  return {
    getValue,
    setValue,
  };
}
