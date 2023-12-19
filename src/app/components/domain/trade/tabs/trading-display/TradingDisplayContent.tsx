import React, { useCallback } from 'react';
import { TradingParametersForm } from './TradingParametersForm';
import { TradingInputs, TradingParameters } from '../../types';

export interface TradingDisplayContentProps {
  readonly value: TradingInputs;
  readonly onValueChange: (value: TradingInputs) => void;
}

export function TradingDisplayContent({
  value,
  onValueChange,
}: TradingDisplayContentProps): React.ReactElement {
  const { params, manualTradeActions } = value;

  const handleTradingParametersChange = useCallback(
    (params: TradingParameters): void => {
      onValueChange({
        ...value,
        params,
      });
    },
    [onValueChange, value],
  );

  return (
    <div>
      <TradingParametersForm
        value={params}
        onValueChange={handleTradingParametersChange}
      />
    </div>
  );
}
