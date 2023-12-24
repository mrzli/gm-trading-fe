import React, { useCallback, useMemo } from 'react';
import { TwChartTimezone } from '../../../tw-chart/types';
import { ActiveOrder, TradingParameters } from '../../types';
import { ValueDisplayDataAnyList } from '../../../types';
import { ValueDisplayItem } from '../../../shared/value-display/ValueDisplayItem';
import { IconButton } from '../../../shared/IconButton';
import { mdiPencil } from '@mdi/js';

export interface ActiveOrderItemProps {
  readonly timezone: TwChartTimezone;
  readonly tradingParams: TradingParameters;
  readonly item: ActiveOrder;
}

export function ActiveOrderItem({
  timezone,
  tradingParams,
  item,
}: ActiveOrderItemProps): React.ReactElement {
  const displayItems = useMemo(
    () => getDisplayItems(timezone, tradingParams, item),
    [timezone, tradingParams, item],
  );

  const handleEdit = useCallback(() => {
    console.log('edit');
  }, []);

  return (
    <div className='flex flex-row items-center gap-2'>
      <div className='flex-1 grid grid-cols-12 items-center gap-2'>
        {displayItems.map((item, index) => {
          return <ValueDisplayItem key={index} item={item} />;
        })}
      </div>
      <IconButton icon={mdiPencil} onClick={handleEdit} />
    </div>
  );
}

function getDisplayItems(
  timezone: TwChartTimezone,
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
