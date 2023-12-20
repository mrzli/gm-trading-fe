import React from 'react';
import { TradingInputs } from '../../types';
import { ManualTradeActionItem } from './ManualTradeActionItem';
import { Button } from '../../../../shared';

export interface ManualTradeActionListProps {
  readonly tradingInputs: TradingInputs;
  readonly onRemoveItemClick: (id: number) => void;
  readonly onRemoveAllItemsClick: () => void;
}

export function ManualTradeActionList({
  tradingInputs,
  onRemoveItemClick,
  onRemoveAllItemsClick,
}: ManualTradeActionListProps): React.ReactElement {
  const { manualTradeActions } = tradingInputs;

  return (
    <div className='flex flex-col gap-1'>
      <div className='flex flex-row justify-between'>
        <div>Manual Trade Actions</div>
        <Button content={'Remove All'} onClick={onRemoveAllItemsClick} />
      </div>
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
    </div>
  );
}
