import React from 'react';
import { ComponentStack } from '../../shared/ComponentStack';
import { TradeLogEntryAny } from '../../types';
import { PrettyDisplay } from '../../../../../shared';

export interface TradingLogProps {
  readonly tradeLog: readonly TradeLogEntryAny[];
}

export function TradingLog({ tradeLog }: TradingLogProps): React.ReactElement {
  return (
    <ComponentStack className='mt-1'>
      <PrettyDisplay content={tradeLog} />
    </ComponentStack>
  );
}
