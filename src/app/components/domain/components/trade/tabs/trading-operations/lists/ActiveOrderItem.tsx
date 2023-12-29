import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActiveOrder, AmendOrderData, TradingParameters } from '../../../types';
import { mdiCancel, mdiCheck, mdiClose, mdiPencil } from '@mdi/js';
import {
  IconButton,
  ValueDisplayDataAnyList,
  ValueDisplayItem,
} from '../../../../shared';
import { ChartTimezone } from '../../../../../types';
import { parseFloatOrThrow } from '@gmjs/number-util';
import { TextInput } from '../../../../../../shared';

export interface ActiveOrderItemProps {
  readonly timezone: ChartTimezone;
  readonly tradingParams: TradingParameters;
  readonly item: ActiveOrder;
  readonly onEdit: (id: number) => void;
  readonly onCancel: (id: number) => void;
  readonly isEditing: boolean;
  readonly onEditOk: (data: AmendOrderData) => void;
  readonly onEditCancel: (id: number) => void;
}

export function ActiveOrderItem({
  timezone,
  tradingParams,
  item,
  onEdit,
  onCancel,
  isEditing,
  onEditOk,
  onEditCancel,
}: ActiveOrderItemProps): React.ReactElement {
  const { priceDecimals } = tradingParams;
  const { id, price, amount, stopLossDistance, limitDistance } = item;

  const displayItems = useMemo(
    () => getDisplayItems(timezone, tradingParams, item),
    [timezone, tradingParams, item],
  );

  const handleEdit = useCallback(() => {
    onEdit(id);
  }, [id, onEdit]);

  const handleCancel = useCallback(() => {
    onCancel(id);
  }, [id, onCancel]);

  const [priceInput, setPriceInput] = useState('');
  const [amountInput, setAmountInput] = useState('');
  const [stopLossDistanceInput, setStopLossDistanceInput] = useState('');
  const [limitDistanceInput, setLimitDistanceInput] = useState('');

  useEffect(() => {
    setPriceInput(price?.toFixed(priceDecimals) ?? '');
    setAmountInput(amount.toFixed(1));
    setStopLossDistanceInput(stopLossDistance?.toFixed(priceDecimals) ?? '');
    setLimitDistanceInput(limitDistance?.toFixed(priceDecimals) ?? '');
  }, [amount, limitDistance, price, priceDecimals, stopLossDistance]);

  const handleEditOk = useCallback(() => {
    const data: AmendOrderData = {
      id,
      price: priceInput === '' ? undefined : parseFloatOrThrow(priceInput),
      amount: parseFloatOrThrow(amountInput),
      stopLossDistance:
        stopLossDistanceInput === ''
          ? undefined
          : parseFloatOrThrow(stopLossDistanceInput),
      limitDistance:
        limitDistanceInput === ''
          ? undefined
          : parseFloatOrThrow(limitDistanceInput),
    };

    onEditOk(data);
  }, [
    amountInput,
    id,
    limitDistanceInput,
    onEditOk,
    priceInput,
    stopLossDistanceInput,
  ]);

  const handleEditCancel = useCallback(() => {
    onEditCancel(id);
  }, [id, onEditCancel]);

  const editForm = (
    <div className='grid grid-cols-[repeat(4,_1fr)_auto] items-end gap-2'>
      <TextInput
        id='price'
        label='Price'
        value={priceInput}
        onValueChange={setPriceInput}
        width={'100%'}
      />
      <TextInput
        id='amount'
        label='Amount'
        value={amountInput}
        onValueChange={setAmountInput}
        width={'100%'}
      />
      <TextInput
        id='stop-loss-distance'
        label='Stop-Loss Distance'
        value={stopLossDistanceInput}
        onValueChange={setStopLossDistanceInput}
        width={'100%'}
      />
      <TextInput
        id='limit-distance'
        label='Limit Distance'
        value={limitDistanceInput}
        onValueChange={setLimitDistanceInput}
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
      <div className='grid grid-cols-[repeat(11,_1fr)_auto] items-center gap-2'>
        {displayItems.map((item, index) => {
          return <ValueDisplayItem key={index} item={item} />;
        })}
        <div className='flex flex-row gap-1'>
          <IconButton icon={mdiPencil} onClick={handleEdit} />
          <IconButton icon={mdiClose} onClick={handleCancel} />
        </div>
      </div>
      {isEditing && editForm}
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
      label: 'Direction',
      value: amount > 0 ? 'Buy' : 'Sell',
    },
    {
      kind: 'date',
      colSpan: 2,
      label: 'Order Time',
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
      label: 'Amount',
      value: amount,
      precision: 1,
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
