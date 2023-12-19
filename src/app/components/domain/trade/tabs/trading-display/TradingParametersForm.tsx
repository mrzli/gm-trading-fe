import React, { useCallback, useState } from 'react';
import { TradingParameters } from '../../types';
import { parseFloatOrThrow } from '@gmjs/number-util';
import { TextInput, Button } from '../../../../shared';

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
    spread,
    marginPercent,
    avgSlippage,
    pipDigit,
    minStopLossDistance,
  } = value;

  const [initialBalanceInput, setInitialBalanceInput] = useState(
    initialBalance.toFixed(2),
  );

  const [spreadInput, setSpreadInput] = useState(spread.toFixed(2));

  const [marginPercentInput, setMarginPercentInput] = useState(
    marginPercent.toFixed(2),
  );

  const [avgSlippageInput, setAvgSlippageInput] = useState(
    avgSlippage.toFixed(2),
  );

  const [pipDigitInput, setPipDigitInput] = useState(pipDigit.toFixed(0));

  const [minStopLossDistanceInput, setMinStopLossDistanceInput] = useState(
    minStopLossDistance.toFixed(2),
  );

  const handleApplyClick = useCallback(() => {
    onValueChange({
      initialBalance: parseFloatOrThrow(initialBalanceInput),
      spread: parseFloatOrThrow(spreadInput),
      marginPercent: parseFloatOrThrow(marginPercentInput),
      avgSlippage: parseFloatOrThrow(avgSlippageInput),
      pipDigit: parseFloatOrThrow(pipDigitInput),
      minStopLossDistance: parseFloatOrThrow(minStopLossDistanceInput),
    });
  }, [
    onValueChange,
    initialBalanceInput,
    spreadInput,
    marginPercentInput,
    avgSlippageInput,
    pipDigitInput,
    minStopLossDistanceInput,
  ]);

  return (
    <div className='flex flex-col gap-1'>
      <TextInput
        id='initial-balance'
        label='Initial Balance'
        value={initialBalanceInput}
        onValueChange={setInitialBalanceInput}
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
        label='Min. Stop Loss Distance'
        value={minStopLossDistanceInput}
        onValueChange={setMinStopLossDistanceInput}
      />
      <div className='col-span-2'>
        <Button onClick={handleApplyClick} content={'Apply'} width={'100%'} />
      </div>
    </div>
  );
}
