import React, { useCallback } from 'react';
import { TradingInputs } from '../../types';
import { Button } from '../../../../../shared';
import { useLocalStorageTradingInputs } from '../../../../hooks';

export interface TradingInputsStorageProps {
  readonly inputs: TradingInputs;
  readonly onInputsLoaded: (value: TradingInputs) => void;
}

export function TradingInputsStorage({
  inputs,
  onInputsLoaded,
}: TradingInputsStorageProps): React.ReactElement {
  const [getTradingInputs, setTradingInputs] = useLocalStorageTradingInputs();

  const handleSave = useCallback(() => {
    setTradingInputs(inputs);
  }, [inputs, setTradingInputs]);

  const handleLoad = useCallback(() => {
    const tradingInputs = getTradingInputs();
    if (tradingInputs) {
      onInputsLoaded(tradingInputs);
    }
  }, [getTradingInputs, onInputsLoaded]);

  return (
    <div className='grid grid-cols-2 gap-2'>
      {/* <TextInput label='Name' value={nameInput} onValueChange={setNameInput} /> */}
      <Button content={'Save'} onClick={handleSave} />
      <Button content={'Load'} onClick={handleLoad} />
    </div>
  );
}
