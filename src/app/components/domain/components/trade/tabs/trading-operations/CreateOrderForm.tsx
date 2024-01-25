import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
} from '../../types';
import { invariant } from '@gmjs/assert';
import {
  PRECISION_POINT,
  SCHEMA_EMPTY_STRING,
  schemaStringDecimalInRange,
} from '../../../../util';
import { TradingParameters } from '@gmjs/gm-trading-shared';
import { CreateOrderStateFinish } from '../../../ticker-data-container/types';

export interface CreateOrderFormProps {
  readonly tradingParams: TradingParameters;
  readonly createOrderData: CreateOrderStateFinish | undefined;
  readonly onCreateOrder: (order: OrderInputs) => void;
  readonly onProposedOrderChange: (order: OrderInputs | undefined) => void;
}

export function CreateOrderForm({
  tradingParams,
  createOrderData,
  onCreateOrder,
  onProposedOrderChange,
}: CreateOrderFormProps): React.ReactElement {
  const schema = useMemo(() => getSchema(tradingParams), [tradingParams]);

  const { handleSubmit, control, formState, getValues, setValue } =
    useForm<CreateOrderFormInputs>({
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

  const [isSubmitHover, setIsSubmitHover] = useState(false);

  useEffect(() => {
    if (!isSubmitHover || !isValid) {
      onProposedOrderChange(undefined);
      return;
    }

    onProposedOrderChange(toOrderInputs(getValues()));
  }, [onProposedOrderChange, isSubmitHover, isValid, getValues]);

  useEffect(
    () => {
      if (!createOrderData) {
        return;
      }

      const { priceDecimals } = tradingParams;

      setValue('direction', createOrderData.direction);
      setValue('price', createOrderData.price?.toFixed(priceDecimals) ?? '');
      setValue('amount', '1');
      setValue(
        'stopLossDistance',
        createOrderData.stopLossDistance?.toFixed(PRECISION_POINT) ?? '',
      );
      setValue(
        'limitDistance',
        createOrderData.limitDistance?.toFixed(PRECISION_POINT) ?? '',
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [createOrderData],
  );

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

  const handleSubmitMouseEnter = useCallback(() => {
    setIsSubmitHover(true);
  }, []);

  const handleSubmitMouseLeave = useCallback(() => {
    setIsSubmitHover(false);
  }, []);

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
          onMouseEnter={handleSubmitMouseEnter}
          onMouseLeave={handleSubmitMouseLeave}
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
