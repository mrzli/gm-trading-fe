import React, { useCallback } from 'react';
import { TradingParametersForm } from './TradingParametersForm';
import {
  ManualTradeActionAny,
  TradingInputs,
  TradingParameters,
} from '../../types';
import { ItemList } from '../../shared';
import { Button } from '../../../../../shared';
import { ManualTradeActionItem } from './ManualTradeActionItem';
import { ComponentStack } from '../../shared/ComponentStack';
import { ChartTimezone } from '../../../../types';
import { TradingInputsStorage } from './TradingInputsStorage';

export interface TradingInputsContentProps {
  readonly timezone: ChartTimezone;
  readonly value: TradingInputs;
  readonly onValueChange: (value: TradingInputs) => void;
}

export function TradingInputsContent({
  value,
  onValueChange,
  timezone,
}: TradingInputsContentProps): React.ReactElement {
  const handleTradingParametersChange = useCallback(
    (params: TradingParameters): void => {
      console.log(params);
      onValueChange({
        ...value,
        params,
      });
    },
    [onValueChange, value],
  );

  const handleRemoveManualActionItem = useCallback(
    (id: number) => {
      const { manualTradeActions } = value;

      const newManualTradeActions = removeManualActionItem(
        id,
        manualTradeActions,
      );
      onValueChange({
        ...value,
        manualTradeActions: newManualTradeActions,
      });
    },
    [onValueChange, value],
  );

  const handleRemoveAllManualActions = useCallback(() => {
    onValueChange({
      ...value,
      manualTradeActions: [],
    });
  }, [onValueChange, value]);

  return (
    <ComponentStack className='mt-1'>
      <TradingInputsStorage inputs={value} onInputsLoaded={onValueChange} />
      <TradingParametersForm
        value={value.params}
        onValueChange={handleTradingParametersChange}
      />
      <ItemList
        title={'Manual Trade Actions'}
        toolbar={
          <Button
            content={'Remove All'}
            onClick={handleRemoveAllManualActions}
          />
        }
        items={value.manualTradeActions}
        itemRenderer={(manualTradeAction, index) => {
          return (
            <ManualTradeActionItem
              key={index}
              timezone={timezone}
              tradingParams={value.params}
              tradeAction={manualTradeAction}
              onRemoveClick={handleRemoveManualActionItem}
            />
          );
        }}
      />
    </ComponentStack>
  );
}

function removeManualActionItem(
  id: number,
  actions: readonly ManualTradeActionAny[],
): readonly ManualTradeActionAny[] {
  const action = actions.find((item) => item.id === id);
  if (!action) {
    return actions;
  }

  return actions.filter((item) => !isActionOrDependent(item, action));
}

function isActionOrDependent(
  item: ManualTradeActionAny,
  action: ManualTradeActionAny,
): boolean {
  const { kind, id } = action;

  return (
    item.id === id ||
    (kind === 'open' && item.kind !== 'open' && item.targetId === id)
  );
}
