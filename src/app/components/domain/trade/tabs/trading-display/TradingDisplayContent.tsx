import React, { useCallback } from 'react';
import { TradingParametersForm } from './TradingParametersForm';
import {
  ManualTradeActionAny,
  TradingInputs,
  TradingParameters,
} from '../../types';
import { ManualTradeActionList } from './ManualTradeActionList';

export interface TradingDisplayContentProps {
  readonly value: TradingInputs;
  readonly onValueChange: (value: TradingInputs) => void;
}

export function TradingDisplayContent({
  value,
  onValueChange,
}: TradingDisplayContentProps): React.ReactElement {
  const handleTradingParametersChange = useCallback(
    (params: TradingParameters): void => {
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

  return (
    <div>
      <TradingParametersForm
        value={value.params}
        onValueChange={handleTradingParametersChange}
      />
      <ManualTradeActionList
        tradingInputs={value}
        onRemoveItemClick={handleRemoveManualActionItem}
      />
    </div>
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
