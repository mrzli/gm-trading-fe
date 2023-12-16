import React, { useCallback, useState } from 'react';
import { TradeSequenceInput } from '../types';
import { TwTextInput } from '../../tw-chart/components/form/TwITextInput';
import { parseFloatOrThrow } from '@gmjs/number-util';
import { TwButton } from '../../tw-chart/components/form/TwButton';
import { TwLabel } from '../../tw-chart/components/display/TwLabel';

export interface TradeSequenceInputsDisplayProps {
  readonly value: TradeSequenceInput;
  readonly onValueChange: (value: TradeSequenceInput) => void;
}

export function TradeSequenceInputsDisplay({
  value,
  onValueChange,
}: TradeSequenceInputsDisplayProps): React.ReactElement {
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
    <div className='grid grid-cols-[auto_minmax(0,1fr)] gap-x-2 gap-y-0.5'>
      <TwLabel htmlFor='initial-balance' content={'Initial Balance:'} />
      <TwTextInput
        id='initial-balance'
        value={initialBalanceInput}
        onValueChange={setInitialBalanceInput}
      />
      <TwLabel htmlFor='spread' content={'Spread:'} />
      <TwTextInput
        id='spread'
        value={spreadInput}
        onValueChange={setSpreadInput}
      />
      <TwLabel htmlFor='margin-percent' content={'Margin (%):'} />
      <TwTextInput
        id='margin-percent'
        value={marginPercentInput}
        onValueChange={setMarginPercentInput}
      />
      <TwLabel htmlFor='avg-slippage' content={'Avg Slippage:'} />
      <TwTextInput
        id='avg-slippage'
        value={avgSlippageInput}
        onValueChange={setAvgSlippageInput}
      />
      <div className='col-span-2'>
        <TwButton onClick={handleApplyClick} content={'Apply'} width={'100%'} />
      </div>
    </div>
  );
}
