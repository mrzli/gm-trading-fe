import React from 'react';

export interface ItemListProps<TItem> {
  readonly title: React.ReactNode;
  readonly toolbar?: React.ReactNode;
  readonly items: readonly TItem[];
  readonly itemRenderer: (item: TItem, index: number) => React.ReactNode;
  readonly itemSeparator?: (
    item: TItem,
    index: number,
    nextItem: TItem | undefined,
  ) => React.ReactNode;
}

export function ItemList<TItem>({
  title,
  toolbar,
  items,
  itemRenderer,
  itemSeparator,
}: ItemListProps<TItem>): React.ReactElement {
  return (
    <div className='flex flex-col gap-1'>
      <div className='flex flex-row justify-between'>
        <div>{title}</div>
        {toolbar}
      </div>
      <div className='flex flex-col gap-2'>
        {items.length > 0 ? (
          items.map((item, index) => (
            <React.Fragment key={index}>
              {itemRenderer(item, index)}
              {index < items.length - 1 && itemSeparator
                ? itemSeparator(item, index, items[index + 1])
                : undefined}
            </React.Fragment>
          ))
        ) : (
          <div className='text-gray-400'>No items</div>
        )}
      </div>
    </div>
  );
}
