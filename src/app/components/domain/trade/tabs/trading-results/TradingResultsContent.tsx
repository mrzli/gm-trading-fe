import React from 'react';
import { TradeProcessState } from '../../types';

export interface TradingResultsContentProps {
  readonly state: TradeProcessState;
}

export function TradingResultsContent({ state }: TradingResultsContentProps): React.ReactElement {
  return (<div>{'TradingResultsContent'}</div>)
}


