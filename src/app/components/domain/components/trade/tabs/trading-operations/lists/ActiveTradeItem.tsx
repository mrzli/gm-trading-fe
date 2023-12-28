import React, { useCallback, useMemo } from 'react';
import { mdiClose, mdiPencil } from '@mdi/js';
import { ActiveTrade, TradingParameters } from '../../../types';
import {
  IconButton,
  ValueDisplayDataAnyList,
  ValueDisplayItem,
} from '../../../../shared';
import { Bar, ChartTimezone } from '../../../../../types';
import { getActiveTradePnl, getActiveTradePnlPoints } from '../../../util';

export interface ActiveTradeItemProps {
  readonly timezone: ChartTimezone;
  readonly tradingParams: TradingParameters;
  readonly bar: Bar;
  readonly item: ActiveTrade;
  readonly onClose: (id: number) => void;
}

export function ActiveTradeItem({
  timezone,
  tradingParams,
  bar,
  item,
  onClose,
}: ActiveTradeItemProps): React.ReactElement {
  const displayItems = useMemo(
    () => getDisplayItems(timezone, tradingParams, bar, item),
    [timezone, tradingParams, bar, item],
  );

  const handleEdit = useCallback(() => {
    console.log('edit');
  }, []);

  const handleClose = useCallback(() => {
    onClose(item.id);
  }, [item.id, onClose]);

  return (
    <div className='flex flex-row items-center gap-2'>
      <div className='flex-1 grid grid-cols-10 items-center gap-2'>
        {displayItems.map((item, index) => {
          return <ValueDisplayItem key={index} item={item} />;
        })}
      </div>
      <div className='flex flex-row gap-1'>
        <IconButton icon={mdiPencil} onClick={handleEdit} />
        <IconButton icon={mdiClose} onClick={handleClose} />
      </div>
    </div>
  );
}

function getDisplayItems(
  timezone: ChartTimezone,
  tradingParams: TradingParameters,
  bar: Bar,
  item: ActiveTrade,
): ValueDisplayDataAnyList {
  const { priceDecimals, spread } = tradingParams;

  const { id, openTime, openPrice, amount, stopLoss, limit } = item;

  const stopLossDistance =
    stopLoss === undefined ? undefined : Math.abs(openPrice - stopLoss);
  const limitDistance =
    limit === undefined ? undefined : Math.abs(openPrice - limit);

  return [
    {
      kind: 'decimal',
      label: 'ID',
      rowSpan: 2,
      value: id,
      precision: 0,
    },
    {
      kind: 'date',
      colSpan: 2,
      label: 'Open Time',
      fontSize: 10,
      value: openTime,
      timezone,
    },
    {
      kind: 'decimal',
      colSpan: 2,
      label: 'Open Price',
      value: openPrice,
      precision: priceDecimals,
    },
    {
      kind: 'decimal',
      label: 'Aount',
      value: amount,
      precision: 1,
    },
    {
      kind: 'decimal',
      colSpan: 2,
      label: 'Stop-Loss',
      value: stopLoss,
      precision: priceDecimals,
    },
    {
      kind: 'decimal',
      colSpan: 2,
      label: 'Limit',
      value: limit,
      precision: priceDecimals,
    },
    {
      kind: 'string',
      label: 'Direction',
      value: amount > 0 ? 'Buy' : 'Sell',
    },
    {
      kind: 'none',
    },
    {
      kind: 'decimal',
      colSpan: 1,
      label: 'P&L Pts',
      value: getActiveTradePnlPoints(item, bar, spread),
      precision: 1,
    },
    {
      kind: 'decimal',
      colSpan: 1,
      label: 'P&L',
      value: getActiveTradePnl(item, bar, spread),
      precision: priceDecimals,
    },
    {
      kind: 'none',
    },
    {
      kind: 'decimal',
      colSpan: 2,
      label: 'Stop-Loss Distance',
      value: stopLossDistance,
      precision: priceDecimals,
    },
    {
      kind: 'decimal',
      colSpan: 2,
      label: 'Limit Distance',
      value: limitDistance,
      precision: priceDecimals,
    },
  ];
}
