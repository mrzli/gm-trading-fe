import React, { useMemo } from 'react';
import { TradeProcessState, TradingDataAndInputs } from '../../types';
import { PrettyDisplay } from '../../../../shared';
import { calculateTradeResults } from '../../util';

export interface TradingDebugDisplayProps {
  readonly inputs: TradingDataAndInputs;
  readonly state: TradeProcessState;
}

export function TradingDebugDisplay({
  inputs,
  state,
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

  const result = useMemo(() => {
    return calculateTradeResults(state);
  }, [state]);

  return (
    <div className='mt-1 flex flex-col gap-2'>
      <PrettyDisplay content={inputsContent} />
      <PrettyDisplay content={result} />
    </div>
  );
}
