/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useMemo } from 'react';
import cls from 'classnames';
import { applyFn } from '@gmjs/apply-function';
import { map, toMap } from '@gmjs/value-transformers';
import { mapGetOrThrow } from '@gmjs/data-container-util';
import { SideToolbarEntry, SideToolbarPosition } from './types';

export interface SideToolbarProps<TValue extends string> {
  readonly position: SideToolbarPosition;
  readonly entries: readonly SideToolbarEntry<TValue>[];
  readonly value: TValue | undefined;
  readonly onValueChange: (value: TValue | undefined) => void;
}

export function SideToolbar<TValue extends string = string>({
  position,
  entries,
  value,
  onValueChange,
}: SideToolbarProps<TValue>): React.ReactElement {
  const entriesMap = useMemo(() => toEntryMap(entries), [entries]);
  const selectedEntry = useMemo(
    () => (value === undefined ? undefined : mapGetOrThrow(entriesMap, value)),
    [entriesMap, value],
  );

  const { value: selectedValue, content: selectedContent } =
    selectedEntry ?? {};

  const tabs = (
    <div className='flex flex-col h-full'>
      {entries.map((entry) =>
        getSideToolbarElement(position, entry, selectedValue, onValueChange),
      )}
    </div>
  );
  const separator = (
    <div className='relative w-0'>
      <div className='absolute h-full w-[1px] bg-slate-100' />
    </div>
  );
  const content = <div className='overflow-y-auto'>{selectedContent}</div>;

  const classes = cls('flex h-full max-h-full', {
    'flex-row': position === 'left',
    'flex-row-reverse': position === 'right',
  });

  return (
    <div className={classes}>
      {content}
      {separator}
      {tabs}
    </div>
  );
}

function toEntryMap<TValue extends string>(
  entries: readonly SideToolbarEntry<TValue>[],
): ReadonlyMap<TValue, SideToolbarEntry<TValue>> {
  return applyFn(
    entries,
    map((entry) => [entry.value, entry] as const),
    toMap(),
  );
}

function getSideToolbarElement<TValue extends string>(
  position: SideToolbarPosition,
  entry: SideToolbarEntry<TValue>,
  selectedValue: TValue | undefined,
  onValueChange: (value: TValue | undefined) => void,
): React.ReactElement {
  const isSelected = entry.value === selectedValue;
  const underlineClasses = cls('h-full w-0.5', {
    'bg-slate-300': isSelected,
    'bg-transparent': !isSelected,
  });

  const classes = cls(
    'flex flex-row rounded-r-md cursor-pointer text-sm hover:bg-slate-100',
    {
      '': position === 'left',
      'rotate-180': position === 'right',
    },
  );

  return (
    <div
      key={entry.value}
      className={classes}
      onClick={() => {
        const newValue = isSelected ? undefined : entry.value;
        onValueChange(newValue);
      }}
    >
      <div className={underlineClasses} />
      <div
        className='px-1 py-2'
        style={{ writingMode: 'vertical-lr' }}
      >
        {entry.tab}
      </div>
    </div>
  );
}
