import React, { useCallback, useState } from 'react';
import { Button, TextInput, ToggleButton } from '../../../../../shared';
import { OrderInputs, TradeDirection } from '../../types';
import { parseFloatOrThrow } from '@gmjs/number-util';

export interface CreateOrderFormProps {
  readonly onSubmit: (order: OrderInputs) => void;
}

export function CreateOrderForm({
  onSubmit,
}: CreateOrderFormProps): React.ReactElement {
  const [tradeDirection, setTradeDirection] = useState<
    TradeDirection | undefined
  >(undefined);

  const [priceInput, setPriceInput] = useState('');

  const [amountInput, setAmountInput] = useState('');

  const [stopLossDistanceInput, setStopLossDistanceInput] = useState('');

  const [limitDistanceInput, setLimitDistanceInput] = useState('');

  const handleBuyClick = useCallback(() => {
    setTradeDirection('buy');
  }, []);

  const handleSellClick = useCallback(() => {
    setTradeDirection('sell');
  }, []);

  const handleSubmit = useCallback(() => {
    if (!tradeDirection) {
      return;
    }

    const order: OrderInputs = {
      direction: tradeDirection,
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
    onSubmit(order);
  }, [
    amountInput,
    limitDistanceInput,
    onSubmit,
    priceInput,
    stopLossDistanceInput,
    tradeDirection,
  ]);

  return (
    <div className='grid grid-cols-[repeat(2,_1fr)_repeat(4,_100px)_1fr] gap-1 '>
      <ToggleButton
        label={'Buy'}
        value={tradeDirection === 'buy'}
        onValueChange={handleBuyClick}
      />
      <ToggleButton
        label={'Sell'}
        value={tradeDirection === 'sell'}
        onValueChange={handleSellClick}
      />
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
      <TextInput
        id='stop-loss-distance'
        label='SL Dist'
        value={stopLossDistanceInput}
        onValueChange={setStopLossDistanceInput}
      />
      <TextInput
        id='limit-distance'
        label='Limit Dist'
        value={limitDistanceInput}
        onValueChange={setLimitDistanceInput}
      />
      <Button content={'Submit'} onClick={handleSubmit} />
    </div>
  );
}
