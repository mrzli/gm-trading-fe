import React, { useCallback, useState } from 'react';
import { TradeSequenceInput } from '../types';
import { parseFloatOrThrow } from '@gmjs/number-util';
import { TextInput, Button } from '../../../shared';

export interface TradeSequenceSetupProps {
  readonly value: TradeSequenceInput;
  readonly onValueChange: (value: TradeSequenceInput) => void;
}

export function TradeSequenceSetup({
  value,
  onValueChange,
}: TradeSequenceSetupProps): React.ReactElement {
  const { initialBalance, spread, marginPercent, avgSlippage } = value;

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

  const handleApplyClick = useCallback(() => {
    onValueChange({
      initialBalance: parseFloatOrThrow(initialBalanceInput),
      spread: parseFloatOrThrow(spreadInput),
      marginPercent: parseFloatOrThrow(marginPercentInput),
      avgSlippage: parseFloatOrThrow(avgSlippageInput),
    });
  }, [
    onValueChange,
    initialBalanceInput,
    spreadInput,
    marginPercentInput,
    avgSlippageInput,
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
      <div className='col-span-2'>
        <Button onClick={handleApplyClick} content={'Apply'} width={'100%'} />
      </div>
    </div>
  );
}
