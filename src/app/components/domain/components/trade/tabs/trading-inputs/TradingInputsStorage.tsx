import React, { useCallback, useMemo, useState } from 'react';
import { z } from 'zod';
import { TradeState } from '@gmjs/gm-trading-shared';
import { TradingDataAndInputs } from '../../types';
import {
  Button,
  SelectButton,
  SelectOption,
  TextInput,
} from '../../../../../shared';

export interface TradingInputsStorageProps {
  readonly tradeStates: readonly TradeState[];
  readonly onSaveTradeState: (tradeState: TradeState) => void;
  readonly onLoadTradeState: (name: string) => void;
  readonly dataAndInputs: TradingDataAndInputs;
}

export function TradingInputsStorage({
  tradeStates,
  onSaveTradeState,
  onLoadTradeState,
  dataAndInputs,
}: TradingInputsStorageProps): React.ReactElement {
  const { settings, barIndex, inputs } = dataAndInputs;
  const { instrumentName, resolution, timezone } = settings;
  const { params, manualTradeActions } = inputs;

  const [saveNameInput, setSaveNameInput] = useState('');

  const isSaveNameInputValid = useMemo(
    () => SCHEMA_SAVE_NAME_INPUT.safeParse(saveNameInput).success,
    [saveNameInput],
  );

  const loadTradeStateOptions = useMemo(() => {
    return tradeStates.map((tradeState: TradeState) =>
      toLoadTradeStateSelectOption(tradeState),
    );
  }, [tradeStates]);

  const [loadTradeStateSelectedValue, setLoadTradeStateSelectedValue] =
    useState<string | undefined>(undefined);

  const handleSaveTradeState = useCallback(() => {
    if (!isSaveNameInputValid) {
      return;
    }

    const tradeState: TradeState = {
      userId: '1',
      saveName: saveNameInput,
      tickerDataSource: 'td365',
      tickerName: instrumentName,
      tickerResolution: resolution,
      timezone,
      barIndex,
      tradingParameters: params,
      manualTradeActions: manualTradeActions,
    };
    onSaveTradeState(tradeState);
  }, [
    barIndex,
    instrumentName,
    isSaveNameInputValid,
    manualTradeActions,
    onSaveTradeState,
    params,
    resolution,
    saveNameInput,
    timezone,
  ]);

  const handleLoadTradeState = useCallback(() => {
    if (loadTradeStateSelectedValue === undefined) {
      return;
    }

    onLoadTradeState(loadTradeStateSelectedValue);
  }, [loadTradeStateSelectedValue, onLoadTradeState]);

  return (
    <div className='grid grid-cols-2 gap-2 items-end'>
      <TextInput
        label='Name'
        value={saveNameInput}
        onValueChange={setSaveNameInput}
      />
      <Button
        content={'Save'}
        onClick={handleSaveTradeState}
        disabled={!isSaveNameInputValid}
      />
      <SelectButton<string, true>
        placeholder='Select trade state...'
        options={loadTradeStateOptions}
        value={loadTradeStateSelectedValue}
        onValueChange={setLoadTradeStateSelectedValue}
        disabled={loadTradeStateOptions.length === 0}
        selectionWidth={'100%'}
        selectItemWidth={'100%'}
      />
      <Button
        content={'Load'}
        onClick={handleLoadTradeState}
        disabled={loadTradeStateSelectedValue === undefined}
      />
    </div>
  );
}

const SCHEMA_SAVE_NAME_INPUT = z.string().min(1).max(255);

function toLoadTradeStateSelectOption(
  tradeState: TradeState,
): SelectOption<string> {
  const { saveName, tickerDataSource, tickerName, tickerResolution } =
    tradeState;

  const label = `${saveName} (${tickerDataSource}, ${tickerName}, ${tickerResolution})`;

  return {
    value: saveName,
    label,
  };
}
