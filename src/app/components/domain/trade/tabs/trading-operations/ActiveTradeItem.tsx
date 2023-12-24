import React, { useCallback, useMemo } from 'react';
import { TwChartTimezone } from '../../../tw-chart/types';
import { ActiveTrade, TradingParameters } from '../../types';
import { ValueDisplayDataAnyList } from '../../../types';
import { ValueDisplayItem } from '../../../shared/value-display/ValueDisplayItem';
import { mdiPencil } from '@mdi/js';
import { IconButton } from '../../../shared/IconButton';

export interface ActiveTradeItemProps {
  readonly timezone: TwChartTimezone;
  readonly tradingParams: TradingParameters;
  readonly item: ActiveTrade;
}

export function ActiveTradeItem({
  timezone,
  tradingParams,
  item,
}: ActiveTradeItemProps): React.ReactElement {
  const displayItems = useMemo(
    () => getDisplayItems(timezone, tradingParams, item),
    [timezone, tradingParams, item],
  );

  const handleEdit = useCallback(() => {
    console.log('edit');
  }, []);

  return (
    <div className='flex flex-row items-center gap-2'>
      <div className='flex-1 grid grid-cols-11 items-center gap-2'>
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
  item: ActiveTrade,
): ValueDisplayDataAnyList {
  const { priceDecimals } = tradingParams;

  const { id, openTime, openPrice, amount, stopLoss, limit } =
    item;

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
