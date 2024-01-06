import React, { useCallback } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { parseFloatOrThrow } from '@gmjs/number-util';
import { TradingParameters } from '../../types';
import { Button } from '../../../../../shared';
import { PRECISION_MONEY, PRECISION_POINT } from '../../../../util';
import { FormControlledTextInput } from '../../../../../shared/form-controlled/FormControlledTextInput';

export interface TradingParametersFormProps {
  readonly value: TradingParameters;
  readonly onValueChange: (value: TradingParameters) => void;
}

export function TradingParametersForm({
  value,
  onValueChange,
}: TradingParametersFormProps): React.ReactElement {
  const { handleSubmit, control } = useForm<TradingParametersInputs>({
    defaultValues: toTradingParametersInputs(value),
  });

  const submitHandler: SubmitHandler<TradingParametersInputs> = useCallback(
    (inputs: TradingParametersInputs) => {
      onValueChange(toTradingParameters(inputs));
    },
    [onValueChange],
  );

  const handleApplyClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      handleSubmit(submitHandler)();
    },
    [handleSubmit, submitHandler],
  );

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
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
          onClick={handleApplyClick}
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
