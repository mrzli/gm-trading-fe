import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { mdiCancel, mdiCheck, mdiClose, mdiPencil } from '@mdi/js';
import { ActiveTrade, AmendTradeData, TradingParameters } from '../../../types';
import {
  IconButton,
  ValueDisplayDataAnyList,
  ValueDisplayItem,
} from '../../../../shared';
import { Bar, ChartTimezone } from '../../../../../types';
import {
  getActiveTradePnl,
  getActiveTradePnlPoints,
  pipAdjust,
  pipAdjustInverse,
} from '../../../util';
import { parseFloatOrThrow } from '@gmjs/number-util';
import { TextInput } from '../../../../../../shared';
import { PRECISION_MONEY, PRECISION_POINT } from '../../../../../util';

export interface ActiveTradeItemProps {
  readonly timezone: ChartTimezone;
  readonly tradingParams: TradingParameters;
  readonly bar: Bar;
  readonly item: ActiveTrade;
  readonly onEdit: (id: number) => void;
  readonly onClose: (id: number) => void;
  readonly isEditing: boolean;
  readonly onEditOk: (data: AmendTradeData) => void;
  readonly onEditCancel: (id: number) => void;
}

export function ActiveTradeItem({
  timezone,
  tradingParams,
  bar,
  item,
  onEdit,
  onClose,
  isEditing,
  onEditOk,
  onEditCancel,
}: ActiveTradeItemProps): React.ReactElement {
  const { priceDecimals } = tradingParams;
  const { id, stopLoss, limit } = item;

  const displayItems = useMemo(
    () => getDisplayItems(timezone, tradingParams, bar, item),
    [timezone, tradingParams, bar, item],
  );

  const handleEdit = useCallback(() => {
    onEdit(id);
  }, [id, onEdit]);

  const handleClose = useCallback(() => {
    onClose(id);
  }, [id, onClose]);

  const [stopLossInput, setStopLossInput] = useState('');
  const [limitInput, setLimitInput] = useState('');

  useEffect(() => {
    setStopLossInput(stopLoss?.toFixed(priceDecimals) ?? '');
    setLimitInput(limit?.toFixed(priceDecimals) ?? '');
  }, [limit, priceDecimals, stopLoss]);

  const handleEditOk = useCallback(() => {
    onEditOk({
      id,
      stopLoss:
        stopLossInput === '' ? undefined : parseFloatOrThrow(stopLossInput),
      limit: limitInput === '' ? undefined : parseFloatOrThrow(limitInput),
    });
  }, [id, limitInput, onEditOk, stopLossInput]);

  const handleEditCancel = useCallback(() => {
    onEditCancel(id);
  }, [id, onEditCancel]);

  const editForm = (
    <div className='grid grid-cols-[repeat(2,_1fr)_auto] items-end gap-2'>
      <TextInput
        id='stop-loss'
        label='Stop-Loss'
        value={stopLossInput}
        onValueChange={setStopLossInput}
        width={'100%'}
      />
      <TextInput
        id='limit'
        label='Limit'
        value={limitInput}
        onValueChange={setLimitInput}
        width={'100%'}
      />
      <div className='flex flex-row gap-1'>
        <IconButton icon={mdiCheck} onClick={handleEditOk} />
        <IconButton icon={mdiCancel} onClick={handleEditCancel} />
      </div>
    </div>
  );

  return (
    <div className='flex flex-col gap-2'>
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
      {isEditing && editForm}
    </div>
  );
}

function getDisplayItems(
  timezone: ChartTimezone,
  tradingParams: TradingParameters,
  bar: Bar,
  item: ActiveTrade,
): ValueDisplayDataAnyList {
  const { priceDecimals, pipDigit, spread: pointSpread } = tradingParams;
  const spread = pipAdjust(pointSpread, pipDigit);

  const { id, openTime, openPrice, amount, stopLoss, limit } = item;

  const stopLossDistance =
    stopLoss === undefined
      ? undefined
      : pipAdjustInverse(Math.abs(openPrice - stopLoss), pipDigit);
  const limitDistance =
    limit === undefined
      ? undefined
      : pipAdjustInverse(Math.abs(openPrice - limit), pipDigit);

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
      label: 'Amount',
      value: amount,
      precision: PRECISION_POINT,
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
      kind: 'pnl',
      colSpan: 1,
      label: 'P&L Pts',
      value: getActiveTradePnlPoints(item, bar, pipDigit, spread),
      precision: PRECISION_POINT,
    },
    {
      kind: 'pnl',
      colSpan: 1,
      label: 'P&L',
      value: getActiveTradePnl(item, bar, pipDigit, spread),
      precision: PRECISION_MONEY,
    },
    {
      kind: 'none',
    },
    {
      kind: 'decimal',
      colSpan: 2,
      label: 'Stop-Loss Distance',
      value: stopLossDistance,
      precision: PRECISION_POINT,
    },
    {
      kind: 'decimal',
      colSpan: 2,
      label: 'Limit Distance',
      value: limitDistance,
      precision: PRECISION_POINT,
    },
  ];
}
