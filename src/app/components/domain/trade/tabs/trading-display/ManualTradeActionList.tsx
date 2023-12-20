import React from 'react';
import { TradingInputs } from '../../types';
import { ManualTradeActionItem } from './ManualTradeActionItem';

export interface ManualTradeActionListProps {
  readonly tradingInputs: TradingInputs;
  readonly onRemoveItemClick: (id: number) => void;
}

export function ManualTradeActionList({
  tradingInputs,
  onRemoveItemClick,
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
            onRemoveClick={onRemoveItemClick}
          />
        );
      })}
    </div>
  );
}
