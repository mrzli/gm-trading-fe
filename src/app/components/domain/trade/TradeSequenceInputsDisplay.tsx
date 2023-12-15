import React, { useCallback, useState } from 'react';
import { TradeSequenceInput } from './types';
import { TwTextInput } from '../tw-chart/components/form/TwITextnput';
import { parseFloatOrThrow } from '@gmjs/number-util';
import { TwButton } from '../tw-chart/components/form/TwButton';

export interface TradeSequenceInputsDisplayProps {
  readonly value: TradeSequenceInput;
  readonly onValueChange: (value: TradeSequenceInput) => void;
}

export function TradeSequenceInputsDisplay({
  value,
  onValueChange,
}: TradeSequenceInputsDisplayProps): React.ReactElement {
  const { initialBalance, spread, avgSlippage } = value;

  const [initialBalanceInput, setInitialBalanceInput] = useState(
    initialBalance.toFixed(2),
  );

  const [spreadInput, setSpreadInput] = useState(spread.toFixed(2));

  const [avgSlippageInput, setAvgSlippageInput] = useState(
    avgSlippage.toFixed(2),
  );

  const handleApplyClick = useCallback(() => {
    onValueChange({
      initialBalance: parseFloatOrThrow(initialBalanceInput),
      spread: parseFloatOrThrow(spreadInput),
      avgSlippage: parseFloatOrThrow(avgSlippageInput),
    });
  }, [onValueChange, initialBalanceInput, spreadInput, avgSlippageInput]);

  return (
    <div className='flex flex-col gap-1'>
      <TwTextInput
        value={initialBalanceInput}
        onValueChange={setInitialBalanceInput}
      />
      <TwTextInput value={spreadInput} onValueChange={setSpreadInput} />
      <TwTextInput
        value={avgSlippageInput}
        onValueChange={setAvgSlippageInput}
      />
      <TwButton onClick={handleApplyClick} content={'Apply'} />
    </div>
  );
}
