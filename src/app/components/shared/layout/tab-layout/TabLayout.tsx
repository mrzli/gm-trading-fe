/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useMemo } from 'react';
import cls from 'classnames';
import { applyFn } from '@gmjs/apply-function';
import { map, toMap } from '@gmjs/value-transformers';
import { mapGetOrThrow } from '@gmjs/data-container-util';
import { TabLayoutEntry } from './types';

export interface TabLayoutProps<TValue extends string> {
  readonly entries: readonly TabLayoutEntry<TValue>[];
  readonly value: TValue;
  readonly onValueChange: (value: TValue) => void;
}

export function TabLayout<TValue extends string = string>({
  entries,
  value,
  onValueChange,
}: TabLayoutProps<TValue>): React.ReactElement {
  const entriesMap = useMemo(() => toEntryMap(entries), [entries]);
  const selectedEntry = useMemo(
    () => mapGetOrThrow(entriesMap, value),
    [entriesMap, value],
  );

  return (
    <div className='flex flex-col max-h-full'>
      <div className='flex flex-row'>
        {entries.map((entry) =>
          getTabElement(entry, selectedEntry.value, onValueChange),
        )}
      </div>
      <hr />
      <div className='overflow-y-auto'>{selectedEntry.content}</div>
    </div>
  );
}

function toEntryMap<TValue extends string>(
  entries: readonly TabLayoutEntry<TValue>[],
): ReadonlyMap<TValue, TabLayoutEntry<TValue>> {
  return applyFn(
    entries,
    map((entry) => [entry.value, entry] as const),
    toMap(),
  );
}

function getTabElement<TValue extends string>(
  entry: TabLayoutEntry<TValue>,
  selectedValue: TValue,
  onValueChange: (value: TValue) => void,
): React.ReactElement {
  const isSelected = entry.value === selectedValue;
  const underlineClasses = cls('w-full h-0.5', {
    'bg-slate-300': isSelected,
    'bg-transparent': !isSelected,
  });

  return (
    <div
      key={entry.value}
      className='cursor-pointer text-sm rounded-t-md hover:bg-slate-100'
      onClick={() => {
        onValueChange(entry.value);
      }}
    >
      <div className='px-2 py-1'>{entry.tab}</div>
      <div className={underlineClasses} />
    </div>
  );
}
