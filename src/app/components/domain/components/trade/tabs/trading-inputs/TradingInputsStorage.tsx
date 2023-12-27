import React, { useCallback } from 'react';
import { TradingInputs } from '../../types';
import { useAppContext } from '../../../../../../util';
import { Button } from '../../../../../shared';

export interface TradingInputsStorageProps {
  readonly inputs: TradingInputs;
  readonly onInputsLoaded: (value: TradingInputs) => void;
}

const SAVE_KEY = 'trading-inputs';

export function TradingInputsStorage({
  inputs,
  onInputsLoaded,
}: TradingInputsStorageProps): React.ReactElement {
  const context = useAppContext();
  const { localStorage } = context.dependencies;

  // const [nameInput, setNameInput] = useState<string>('');

  const handleSave = useCallback(() => {
    localStorage.set(SAVE_KEY, JSON.stringify(inputs));
  }, [inputs, localStorage]);

  const handleLoad = useCallback(() => {
    const loaded = localStorage.get(SAVE_KEY);
    if (loaded) {
      const parsed = JSON.parse(loaded);
      onInputsLoaded(parsed);
    }
  }, [localStorage, onInputsLoaded]);

  return (
    <div className='grid grid-cols-2 gap-2'>
      {/* <TextInput label='Name' value={nameInput} onValueChange={setNameInput} /> */}
      <Button content={'Save'} onClick={handleSave} />
      <Button content={'Load'} onClick={handleLoad} />
    </div>
  );
}
