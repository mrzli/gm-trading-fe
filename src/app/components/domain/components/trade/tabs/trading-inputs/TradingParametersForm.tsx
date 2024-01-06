import React, { useCallback, useMemo } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { parseFloatOrThrow } from '@gmjs/number-util';
import { TradingParameters } from '../../types';
import { Button, FormControlledTextInput } from '../../../../../shared';
import {
  PRECISION_MONEY,
  PRECISION_POINT,
  schemaStringDecimalInRange,
  schemaStringIntegerInRange,
} from '../../../../util';

export interface TradingParametersFormProps {
  readonly value: TradingParameters;
  readonly onValueChange: (value: TradingParameters) => void;
}

export function TradingParametersForm({
  value,
  onValueChange,
}: TradingParametersFormProps): React.ReactElement {
  const { handleSubmit, control, formState } = useForm<TradingParametersInputs>(
    {
      defaultValues: toTradingParametersInputs(value),
      resolver: zodResolver(SCHEMA),
    },
  );

  const { isValid } = formState;

  const submitHandler: SubmitHandler<TradingParametersInputs> = useCallback(
    (inputs: TradingParametersInputs) => {
      onValueChange(toTradingParameters(inputs));
    },
    [onValueChange],
  );

  const triggerSubmit = useMemo(
    () => handleSubmit(submitHandler),
    [handleSubmit, submitHandler],
  );

  return (
    <form onSubmit={triggerSubmit}>
      <div className='grid grid-cols-[repeat(7,_80px)_1fr] gap-1 items-end'>
        <FormControlledTextInput<TradingParametersInputs, 'initialBalance'>
          control={control}
          id={'initialBalance'}
          name={'initialBalance'}
          label={'Initial Balance'}
        />
        <FormControlledTextInput<TradingParametersInputs, 'priceDecimals'>
          control={control}
          id={'priceDecimals'}
          name={'priceDecimals'}
          label={'Price Decimals'}
        />
        <FormControlledTextInput<TradingParametersInputs, 'spread'>
          control={control}
          id={'spread'}
          name={'spread'}
          label={'Spread'}
        />
        <FormControlledTextInput<TradingParametersInputs, 'marginPercent'>
          control={control}
          id={'marginPercent'}
          name={'marginPercent'}
          label={'Margin (%)'}
        />
        <FormControlledTextInput<TradingParametersInputs, 'avgSlippage'>
          control={control}
          id={'avgSlippage'}
          name={'avgSlippage'}
          label={'Avg. Slippage'}
        />
        <FormControlledTextInput<TradingParametersInputs, 'pipDigit'>
          control={control}
          id={'pipDigit'}
          name={'pipDigit'}
          label={'Pip Digit'}
        />
        <FormControlledTextInput<TradingParametersInputs, 'minStopLossDistance'>
          control={control}
          id={'minStopLossDistance'}
          name={'minStopLossDistance'}
          label={'Min SL Dist'}
        />
        <Button
          type={'submit'}
          onClick={triggerSubmit}
          preventDefault={true}
          disabled={!isValid}
          content={'Apply'}
          width={'100%'}
        />
      </div>
    </form>
  );
}

interface TradingParametersInputs {
  readonly initialBalance: string;
  readonly priceDecimals: string;
  readonly spread: string;
  readonly marginPercent: string;
  readonly avgSlippage: string;
  readonly pipDigit: string;
  readonly minStopLossDistance: string;
}

const SCHEMA = z.object({
  initialBalance: schemaStringDecimalInRange(PRECISION_MONEY, 100, 1_000_000),
  priceDecimals: schemaStringIntegerInRange(0, 8),
  spread: schemaStringDecimalInRange(PRECISION_POINT, 0, 10_000),
  marginPercent: schemaStringDecimalInRange(2, 0, 100),
  avgSlippage: schemaStringDecimalInRange(PRECISION_POINT, 0, 10_000),
  pipDigit: schemaStringIntegerInRange(-8, 8),
  minStopLossDistance: schemaStringDecimalInRange(PRECISION_POINT, 0, 10_000),
});

function toTradingParametersInputs(
  tradingParameters: TradingParameters,
): TradingParametersInputs {
  const {
    initialBalance,
    priceDecimals,
    spread,
    marginPercent,
    avgSlippage,
    pipDigit,
    minStopLossDistance,
  } = tradingParameters;

  return {
    initialBalance: initialBalance.toFixed(PRECISION_MONEY),
    priceDecimals: priceDecimals.toFixed(0),
    spread: spread.toFixed(PRECISION_POINT),
    marginPercent: marginPercent.toFixed(2),
    avgSlippage: avgSlippage.toFixed(PRECISION_POINT),
    pipDigit: pipDigit.toFixed(0),
    minStopLossDistance: minStopLossDistance.toFixed(PRECISION_POINT),
  };
}

function toTradingParameters(
  tradingParametersInputs: TradingParametersInputs,
): TradingParameters {
  const {
    initialBalance,
    priceDecimals,
    spread,
    marginPercent,
    avgSlippage,
    pipDigit,
    minStopLossDistance,
  } = tradingParametersInputs;

  return {
    initialBalance: parseFloatOrThrow(initialBalance),
    priceDecimals: parseFloatOrThrow(priceDecimals),
    spread: parseFloatOrThrow(spread),
    marginPercent: parseFloatOrThrow(marginPercent),
    avgSlippage: parseFloatOrThrow(avgSlippage),
    pipDigit: parseFloatOrThrow(pipDigit),
    minStopLossDistance: parseFloatOrThrow(minStopLossDistance),
  };
}
