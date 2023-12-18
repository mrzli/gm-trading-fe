import React, { useCallback, useState } from 'react';
import { OrderInput } from '../types';
import { parseFloatOrThrow } from '@gmjs/number-util';
import { TextInput, Button } from '../../../shared';

export interface OrderEntryProps {
  readonly value: OrderInput;
  readonly onValueChange: (value: OrderInput) => void;
}

export function OrderEntry({
  value,
  onValueChange,
}: OrderEntryProps): React.ReactElement {
  const { price, amount } = value;

  const [priceInput, setPriceInput] = useState(price?.toFixed(2) ?? '');

  const [amountInput, setAmountInput] = useState(amount.toFixed(2));

  const handleOrderClick = useCallback(() => {
    onValueChange({
      price: priceInput === '' ? undefined : parseFloatOrThrow(priceInput),
      amount: parseFloatOrThrow(amountInput),
    });
  }, [onValueChange, priceInput, amountInput]);

  return (
    <div className='flex flex-col gap-1'>
      <TextInput
        id='price'
        label='Price'
        value={priceInput}
        onValueChange={setPriceInput}
      />
      <TextInput
        id='amount'
        label='Amount'
        value={amountInput}
        onValueChange={setAmountInput}
      />
      <Button onClick={handleOrderClick} content={'Order'} />
    </div>
  );
}
