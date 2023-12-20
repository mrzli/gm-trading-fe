import React, { useMemo } from 'react';
import { TradeResult, TradingDataAndInputs } from '../../types';
import { PrettyDisplay } from '../../../../shared';

export interface TradingDebugDisplayProps {
  readonly inputs: TradingDataAndInputs;
  readonly result: TradeResult;
}

export function TradingDebugDisplay({
  inputs,
  result
}: TradingDebugDisplayProps): React.ReactElement {
  const inputsContent = useMemo<TradingDataAndInputs>(() => {
    return {
      ...inputs,
      chartData: {
        ...inputs.chartData,
        barData: inputs.chartData.barData.slice(0, 2),
      },
    };
  }, [inputs]);

  return (
    <div className='mt-1 flex flex-col gap-2'>
      <PrettyDisplay content={inputsContent} />
      <PrettyDisplay content={result} />
    </div>
  );
}
