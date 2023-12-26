import React from 'react';
import { TradeProcessState } from '../../types';
import { ComponentStack } from '../../shared/ComponentStack';

export interface TradingResultsContentProps {
  readonly state: TradeProcessState;
}

export function TradingResultsContent({
  state,
}: TradingResultsContentProps): React.ReactElement {
  return (
    <ComponentStack className='mt-1'>{'TradingResultsContent'}</ComponentStack>
  );
}
