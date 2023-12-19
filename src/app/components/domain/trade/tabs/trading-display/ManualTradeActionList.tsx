import React from 'react';
import { TradingInputs } from '../../types';
import { ManualTradeActionItem } from './ManualTradeActionItem';

export interface ManualTradeActionListProps {
  readonly tradingInputs: TradingInputs;
}

export function ManualTradeActionList({
  tradingInputs,
}: ManualTradeActionListProps): React.ReactElement {
  const { manualTradeActions } = tradingInputs;

  return (
    <div className='flex flex-col'>
      {manualTradeActions.map((manualTradeAction, index) => {
        return (
          <ManualTradeActionItem
            key={index}
            tradingInputs={tradingInputs}
            tradeAction={manualTradeAction}
          />
        );
      })}
    </div>
  );
}
