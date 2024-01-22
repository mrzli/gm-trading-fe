import React, { useCallback } from 'react';
import { TradingParametersForm } from './TradingParametersForm';
import { TradingDataAndInputs, TradingInputs } from '../../types';
import { ItemList } from '../../shared';
import { Button } from '../../../../../shared';
import { ManualTradeActionItem } from './ManualTradeActionItem';
import { ComponentStack } from '../../shared/ComponentStack';
import { TradingInputsStorage } from './TradingInputsStorage';
import {
  ManualTradeActionAny,
  TradeState,
  TradingParameters,
} from '@gmjs/gm-trading-shared';

export interface TradingInputsContentProps {
  readonly tradeStates: readonly TradeState[];
  readonly onSaveTradeState: (tradeState: TradeState) => void;
  readonly dataAndInputs: TradingDataAndInputs;
  readonly value: TradingInputs;
  readonly onValueChange: (value: TradingInputs) => void;
}

export function TradingInputsContent({
  tradeStates,
  onSaveTradeState,
  dataAndInputs,
  value,
  onValueChange,
}: TradingInputsContentProps): React.ReactElement {
  const { settings } = dataAndInputs;
  const { timezone } = settings;

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

  const handleRemoveAllManualActions = useCallback(() => {
    onValueChange({
      ...value,
      manualTradeActions: [],
    });
  }, [onValueChange, value]);

  return (
    <ComponentStack className='mt-1'>
      <TradingInputsStorage
        tradeStates={tradeStates}
        onSaveTradeState={onSaveTradeState}
        dataAndInputs={dataAndInputs}
        onInputsLoaded={onValueChange}
      />
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
      {/* <div>
        {FORM_BUILDER.build({
          entries: [
            {
              kind: 'text-input',
            },
            {
              kind: 'select',
            },
            {
              kind: 'text-input',
            },
            {
              kind: 'select',
            },
          ],
        })}
      </div> */}
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
