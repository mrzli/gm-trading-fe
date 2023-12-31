import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { clamp, parseIntegerOrThrow } from '@gmjs/number-util';
import { TextInput } from '../../../../../../shared';
import {
  createSchemaIntegerInRange,
  createSchemaReplayInput,
} from '../../../../chart-toolbar/util';
import { BarReplayPosition } from '../../../../../types';

export interface BarReplaySetBarIndexProps {
  readonly dataLength: number;
  readonly replayPosition: BarReplayPosition;
  readonly onReplayPositionChange: (position: BarReplayPosition) => void;
}

export function BarReplaySetBarIndex({
  dataLength,
  replayPosition,
  onReplayPositionChange,
}: BarReplaySetBarIndexProps): React.ReactElement {
  const { barIndex } = replayPosition;

  const [barIndexInput, setBarIndexInput] = useState<string>('');

  useEffect(() => {
    setBarIndexInput(barIndex === undefined ? '' : barIndex.toString());
  }, [barIndex]);

  const isReplayInputValid = useMemo(() => {
    return createSchemaReplayInput(1, dataLength).safeParse(barIndexInput)
      .success;
  }, [barIndexInput, dataLength]);

  const isReplayValueValid = useMemo(() => {
    return createSchemaIntegerInRange(1, dataLength).safeParse(barIndexInput)
      .success;
  }, [barIndexInput, dataLength]);

  const handleReplaySetBarIndex = useCallback(() => {
    if (barIndexInput === '') {
      onReplayPositionChange({ barIndex: undefined, subBarIndex: 0 });
      return;
    }

    if (!isReplayValueValid) {
      return;
    }

    const barIndexNum = parseIntegerOrThrow(barIndexInput);
    const newBarIndex = clamp(barIndexNum, 1, dataLength);

    onReplayPositionChange({ barIndex: newBarIndex, subBarIndex: 0 });
  }, [barIndexInput, dataLength, isReplayValueValid, onReplayPositionChange]);

  const handleReplayInputKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        handleReplaySetBarIndex();
      }
    },
    [handleReplaySetBarIndex],
  );

  return (
    <div className='inline-flex flex-row gap-0.5'>
      <TextInput
        placeholder={`Replay 1-${dataLength}`}
        value={barIndexInput}
        onValueChange={setBarIndexInput}
        onKeyDown={handleReplayInputKeyDown}
        error={!isReplayInputValid}
        width={140}
      />
    </div>
  );
}
