import React from 'react';

export interface ItemListProps<TItem> {
  readonly title: React.ReactNode;
  readonly toolbar?: React.ReactNode;
  readonly items: readonly TItem[];
  readonly itemRenderer: (item: TItem, index: number) => React.ReactNode;
}

export function ItemList<TItem>({
  title,
  toolbar,
  items,
  itemRenderer,
}: ItemListProps<TItem>): React.ReactElement {
  return (
    <div className='flex flex-col gap-1'>
      <div className='flex flex-row justify-between'>
        <div>{title}</div>
        {toolbar}
      </div>
      <div className='flex flex-col gap-2'>
        {items.length > 0 ? (
          items.map((item, index) => itemRenderer(item, index))
        ) : (
          <div className='text-gray-400'>No items</div>
        )}
      </div>
    </div>
  );
}
