import React, { useCallback, useMemo } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { parseFloatOrThrow } from '@gmjs/number-util';
import {
  Button,
  FormControlledTextInput,
  ToggleButton,
} from '../../../../../shared';
import {
  OrderInputs,
  TYPES_OF_TRADE_DIRECTIONS,
  TradeDirection,
  TradingParameters,
} from '../../types';
import { invariant } from '@gmjs/assert';
import {
  SCHEMA_EMPTY_STRING,
  schemaStringDecimalInRange,
} from '../../../../util';

export interface CreateOrderFormProps {
  readonly tradingParams: TradingParameters;
  readonly onCreateOrder: (order: OrderInputs) => void;
}

export function CreateOrderForm({
  tradingParams,
  onCreateOrder,
}: CreateOrderFormProps): React.ReactElement {
  const schema = useMemo(() => getSchema(tradingParams), [tradingParams]);

  const { handleSubmit, control, formState } = useForm<CreateOrderFormInputs>({
    defaultValues: {
      direction: undefined,
      price: '',
      amount: '',
      stopLossDistance: '',
      limitDistance: '',
    },
    resolver: zodResolver(schema),
  });

  const { isValid } = formState;

  const submitHandler: SubmitHandler<CreateOrderFormInputs> = useCallback(
    (inputs: CreateOrderFormInputs) => {
      onCreateOrder(toOrderInputs(inputs));
    },
    [onCreateOrder],
  );

  const triggerSubmit = useMemo(
    () => handleSubmit(submitHandler),
    [handleSubmit, submitHandler],
  );

  return (
    <form onSubmit={triggerSubmit}>
      <div className='grid grid-cols-[1fr_repeat(4,_100px)_1fr] gap-1 items-end'>
        <Controller<CreateOrderFormInputs, 'direction'>
          name={'direction'}
          control={control}
          render={({ field }) => {
            const { onChange, value, ...fieldRest } = field;

            return (
              <div className='grid grid-cols-2 gap-1' {...fieldRest}>
                <ToggleButton
                  label={'Buy'}
                  value={value === 'buy'}
                  onValueChange={(value: boolean) => {
                    if (value) {
                      onChange('buy');
                    }
                  }}
                />
                <ToggleButton
                  label={'Sell'}
                  value={value === 'sell'}
                  onValueChange={(value: boolean) => {
                    if (value) {
                      onChange('sell');
                    }
                  }}
                />
              </div>
            );
          }}
        />
        <FormControlledTextInput<CreateOrderFormInputs, 'price'>
          control={control}
          id={'price'}
          name={'price'}
          label={'Price'}
        />
        <FormControlledTextInput<CreateOrderFormInputs, 'amount'>
          control={control}
          id={'amount'}
          name={'amount'}
          label={'Amount'}
        />
        <FormControlledTextInput<CreateOrderFormInputs, 'stopLossDistance'>
          control={control}
          id={'stopLossDistance'}
          name={'stopLossDistance'}
          label={'SL Dist'}
        />
        <FormControlledTextInput<CreateOrderFormInputs, 'limitDistance'>
          control={control}
          id={'limitDistance'}
          name={'limitDistance'}
          label={'Limit Dist'}
        />
        <Button
          type={'submit'}
          onClick={triggerSubmit}
          preventDefault={true}
          disabled={!isValid}
          content={'Submit'}
          width={'100%'}
        />
      </div>
    </form>
  );
}

interface CreateOrderFormInputs {
  readonly direction: TradeDirection | undefined;
  readonly price: string;
  readonly amount: string;
  readonly stopLossDistance: string;
  readonly limitDistance: string;
}

function getSchema(
  tradingParams: TradingParameters,
): ReturnType<typeof z.object> {
  const { minStopLossDistance } = tradingParams;

  return z.object({
    direction: z.enum(TYPES_OF_TRADE_DIRECTIONS),
    price: z.union([
      SCHEMA_EMPTY_STRING,
      schemaStringDecimalInRange(undefined, 0, 1_000_000_000),
    ]),
    amount: schemaStringDecimalInRange(undefined, 0.5, 1000),
    stopLossDistance: z.union([
      SCHEMA_EMPTY_STRING,
      schemaStringDecimalInRange(undefined, minStopLossDistance, 1_000_000),
    ]),
    limitDistance: z.union([
      SCHEMA_EMPTY_STRING,
      schemaStringDecimalInRange(undefined, minStopLossDistance, 1_000_000),
    ]),
  });
}

function toOrderInputs(inputs: CreateOrderFormInputs): OrderInputs {
  const { direction, price, amount, stopLossDistance, limitDistance } = inputs;

  invariant(direction !== undefined, 'Trade direction is undefined.');

  return {
    direction,
    price: price === '' ? undefined : parseFloatOrThrow(price),
    amount: parseFloatOrThrow(amount),
    stopLossDistance:
      stopLossDistance === '' ? undefined : parseFloatOrThrow(stopLossDistance),
    limitDistance:
      limitDistance === '' ? undefined : parseFloatOrThrow(limitDistance),
  };
}
