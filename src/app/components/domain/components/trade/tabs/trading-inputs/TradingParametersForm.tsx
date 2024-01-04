import React, { useCallback, useEffect, useState } from 'react';
import { TradingParameters } from '../../types';
import { parseFloatOrThrow } from '@gmjs/number-util';
import { TextInput, Button } from '../../../../../shared';
import { PRECISION_MONEY, PRECISION_POINT } from '../../../../util';

export interface TradingParametersFormProps {
  readonly value: TradingParameters;
  readonly onValueChange: (value: TradingParameters) => void;
}

export function TradingParametersForm({
  value,
  onValueChange,
}: TradingParametersFormProps): React.ReactElement {
  const {
    initialBalance,
    priceDecimals,
    spread,
    marginPercent,
    avgSlippage,
    pipDigit,
    minStopLossDistance,
  } = value;

  const [initialBalanceInput, setInitialBalanceInput] = useState(
    initialBalance.toFixed(PRECISION_MONEY),
  );

  const [priceDecimalsInput, setPriceDecimalsInput] = useState(
    priceDecimals.toFixed(0),
  );

  const [spreadInput, setSpreadInput] = useState(spread.toFixed(PRECISION_POINT));

  const [marginPercentInput, setMarginPercentInput] = useState(
    marginPercent.toFixed(2),
  );

  const [avgSlippageInput, setAvgSlippageInput] = useState(
    avgSlippage.toFixed(PRECISION_POINT),
  );

  const [pipDigitInput, setPipDigitInput] = useState(pipDigit.toFixed(0));

  const [minStopLossDistanceInput, setMinStopLossDistanceInput] = useState(
    minStopLossDistance.toFixed(PRECISION_POINT),
  );

  useEffect(() => {
    setInitialBalanceInput(initialBalance.toFixed(PRECISION_MONEY));
    setPriceDecimalsInput(priceDecimals.toFixed(0));
    setSpreadInput(spread.toFixed(PRECISION_POINT));
    setMarginPercentInput(marginPercent.toFixed(2));
    setAvgSlippageInput(avgSlippage.toFixed(PRECISION_POINT));
    setPipDigitInput(pipDigit.toFixed(0));
    setMinStopLossDistanceInput(minStopLossDistance.toFixed(PRECISION_POINT));
  }, [
    avgSlippage,
    initialBalance,
    marginPercent,
    minStopLossDistance,
    pipDigit,
    priceDecimals,
    spread,
  ]);

  const handleApplyClick = useCallback(() => {
    onValueChange({
      initialBalance: parseFloatOrThrow(initialBalanceInput),
      priceDecimals: parseFloatOrThrow(priceDecimalsInput),
      spread: parseFloatOrThrow(spreadInput),
      marginPercent: parseFloatOrThrow(marginPercentInput),
      avgSlippage: parseFloatOrThrow(avgSlippageInput),
      pipDigit: parseFloatOrThrow(pipDigitInput),
      minStopLossDistance: parseFloatOrThrow(minStopLossDistanceInput),
    });
  }, [
    onValueChange,
    initialBalanceInput,
    priceDecimalsInput,
    spreadInput,
    marginPercentInput,
    avgSlippageInput,
    pipDigitInput,
    minStopLossDistanceInput,
  ]);

  return (
    <div className='grid grid-cols-[repeat(7,_80px)_1fr] gap-1 items-end'>
      <TextInput
        id='initial-balance'
        label='Initial Balance'
        value={initialBalanceInput}
        onValueChange={setInitialBalanceInput}
      />
      <TextInput
        id='price-decimals'
        label='Price Decimals'
        value={priceDecimalsInput}
        onValueChange={setPriceDecimalsInput}
      />
      <TextInput
        id='spread'
        label='Spread'
        value={spreadInput}
        onValueChange={setSpreadInput}
      />
      <TextInput
        id='margin-percent'
        label='Margin (%)'
        value={marginPercentInput}
        onValueChange={setMarginPercentInput}
      />
      <TextInput
        id='avg-slippage'
        label='Avg. Slippage'
        value={avgSlippageInput}
        onValueChange={setAvgSlippageInput}
      />
      <TextInput
        id='pip-digit'
        label='Pip Digit'
        value={pipDigitInput}
        onValueChange={setPipDigitInput}
      />
      <TextInput
        id='min-stop-loss-distance'
        label='Min SL Dist'
        value={minStopLossDistanceInput}
        onValueChange={setMinStopLossDistanceInput}
      />
      <Button onClick={handleApplyClick} content={'Apply'} width={'100%'} />
    </div>
  );
}
