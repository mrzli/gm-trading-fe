import React from 'react';
import { ComponentStack } from '../../shared/ComponentStack';
import { TradeProcessState, TradingDataAndInputs } from '../../types';
import { PrettyDisplay } from '../../../../../shared';

export interface TradingLogProps {
  readonly dataAndInputs: TradingDataAndInputs;
  readonly state: TradeProcessState;
}

export function TradingLog({
  dataAndInputs,
  state,
}: TradingLogProps): React.ReactElement {
  const { inputs } = dataAndInputs;
  const { tradeLog } = state;

  return (
    <ComponentStack className='mt-1'>
      <PrettyDisplay content={tradeLog} />
    </ComponentStack>
  );
}
