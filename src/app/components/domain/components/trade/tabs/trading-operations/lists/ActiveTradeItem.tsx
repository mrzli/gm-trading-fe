import React, { useCallback, useMemo } from 'react';
import { mdiClose, mdiPencil } from '@mdi/js';
import { ActiveTrade, TradingParameters } from '../../../types';
import {
  IconButton,
  ValueDisplayDataAnyList,
  ValueDisplayItem,
} from '../../../../shared';
import { ChartTimezone } from '../../../../../types';

export interface ActiveTradeItemProps {
  readonly timezone: ChartTimezone;
  readonly tradingParams: TradingParameters;
  readonly item: ActiveTrade;
  readonly onClose: (id: number) => void;
}

export function ActiveTradeItem({
  timezone,
  tradingParams,
  item,
  onClose,
}: ActiveTradeItemProps): React.ReactElement {
  const displayItems = useMemo(
    () => getDisplayItems(timezone, tradingParams, item),
    [timezone, tradingParams, item],
  );

  const handleEdit = useCallback(() => {
    console.log('edit');
  }, []);

  const handleClose = useCallback(() => {
    onClose(item.id);
  }, [item.id, onClose]);

  return (
    <div className='flex flex-row items-center gap-2'>
      <div className='flex-1 grid grid-cols-11 items-center gap-2'>
        {displayItems.map((item, index) => {
          return <ValueDisplayItem key={index} item={item} />;
        })}
      </div>
      <div className='flex flex-row gap-2'>
        <IconButton icon={mdiPencil} onClick={handleEdit} />
        <IconButton icon={mdiClose} onClick={handleClose} />
      </div>
    </div>
  );
}

function getDisplayItems(
  timezone: ChartTimezone,
  tradingParams: TradingParameters,
  item: ActiveTrade,
): ValueDisplayDataAnyList {
  const { priceDecimals } = tradingParams;

  const { id, openTime, openPrice, amount, stopLoss, limit } = item;

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
      label: 'O Tm',
      fontSize: 10,
      value: openTime,
      timezone,
    },
    {
      kind: 'decimal',
      colSpan: 2,
      label: 'O Prc',
      value: openPrice,
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
      label: 'SL',
      value: stopLoss,
      precision: priceDecimals,
    },
    {
      kind: 'decimal',
      colSpan: 2,
      label: 'Lmt',
      value: limit,
      precision: priceDecimals,
    },
  ];
}
