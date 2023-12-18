/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useMemo } from 'react';
import cls from 'classnames';
import { applyFn } from '@gmjs/apply-function';
import { compose } from '@gmjs/compose-function';
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

  const tabClickHandlerMap = useMemo(
    () => toTabClickHandlerMap(entries, onValueChange),
    [entries, onValueChange],
  );

  const tabElements = useMemo(() => {
    return entries.map((entry) => {
      const isSelected = entry.value === selectedEntry.value;
      const handler = mapGetOrThrow(tabClickHandlerMap, entry.value);

      const underlineClasses = cls('w-full h-0.5', {
        'bg-slate-300': isSelected,
        'bg-transparent': !isSelected,
      });

      return (
        <div
          key={entry.value}
          className='cursor-pointer text-sm rounded-t-md hover:bg-slate-100'
          onClick={handler}
        >
          <div className='px-2 py-1'>{entry.tab}</div>
          <div className={underlineClasses} />
        </div>
      );
    });
  }, [entries, selectedEntry.value, tabClickHandlerMap]);

  const contentElement = useMemo(() => {
    return <div className='px-2 py-1'>{selectedEntry.content}</div>;
  }, [selectedEntry.content]);

  return (
    <div className='flex flex-col'>
      <div className='flex flex-row'>{tabElements}</div>
      <hr />
      <div>{contentElement}</div>
    </div>
  );
}

function toEntryMap<TValue extends string>(
  entries: readonly TabLayoutEntry<TValue>[],
): ReadonlyMap<TValue, TabLayoutEntry<TValue>> {
  return applyFn(
    entries,
    compose(
      map((entry) => [entry.value, entry] as const),
      toMap(),
    ),
  );
}

function toTabClickHandlerMap<TValue extends string>(
  entries: readonly TabLayoutEntry<TValue>[],
  onValueChange: (value: TValue) => void,
): ReadonlyMap<TValue, () => void> {
  return applyFn(
    entries,
    compose(
      map(
        (entry) =>
          [
            entry.value,
            (): void => {
              onValueChange(entry.value);
            },
          ] as const,
      ),
      toMap(),
    ),
  );
}
