import React, { useCallback, useMemo } from 'react';
import { ActiveOrder, TradingParameters } from '../../../types';
import { mdiClose, mdiPencil } from '@mdi/js';
import {
  IconButton,
  ValueDisplayDataAnyList,
  ValueDisplayItem,
} from '../../../../shared';
import { ChartTimezone } from '../../../../../types';

export interface ActiveOrderItemProps {
  readonly timezone: ChartTimezone;
  readonly tradingParams: TradingParameters;
  readonly item: ActiveOrder;
  readonly onCancel: (id: number) => void;
}

export function ActiveOrderItem({
  timezone,
  tradingParams,
  item,
  onCancel,
}: ActiveOrderItemProps): React.ReactElement {
  const displayItems = useMemo(
    () => getDisplayItems(timezone, tradingParams, item),
    [timezone, tradingParams, item],
  );

  const handleEdit = useCallback(() => {
    console.log('edit');
  }, []);

  const handleCancel = useCallback(() => {
    onCancel(item.id);
  }, [item.id, onCancel]);

  return (
    <div className='flex flex-row items-center gap-2'>
      <div className='flex-1 grid grid-cols-12 items-center gap-2'>
        {displayItems.map((item, index) => {
          return <ValueDisplayItem key={index} item={item} />;
        })}
      </div>
      <div className='flex flex-row gap-2'>
        <IconButton icon={mdiPencil} onClick={handleEdit} />
        <IconButton icon={mdiClose} onClick={handleCancel} />
      </div>
    </div>
  );
}

function getDisplayItems(
  timezone: ChartTimezone,
  tradingParams: TradingParameters,
  item: ActiveOrder,
): ValueDisplayDataAnyList {
  const { priceDecimals } = tradingParams;

  const { id, time, price, amount, stopLossDistance, limitDistance } = item;

  return [
    {
      kind: 'decimal',
      label: 'ID',
      value: id,
      precision: 0,
    },
    {
      kind: 'string',
      label: 'Dir',
      value: amount > 0 ? 'B' : 'S',
    },
    {
      kind: 'date',
      colSpan: 2,
      label: 'Time',
      fontSize: 10,
      value: time,
      timezone,
    },
    {
      kind: 'decimal',
      colSpan: 2,
      label: 'Price',
      value: price,
      precision: priceDecimals,
    },
    {
      kind: 'decimal',
      label: 'Amt',
      value: amount,
      precision: 1,
    },
    {
      kind: 'decimal',
      colSpan: 2,
      label: 'SL Dst',
      value: stopLossDistance,
      precision: priceDecimals,
    },
    {
      kind: 'decimal',
      colSpan: 2,
      label: 'L Dst',
      value: limitDistance,
      precision: priceDecimals,
    },
  ];
}