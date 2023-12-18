import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { TextInput } from '../../../../../../../shared/input/TextInput';
import {
  createSchemaIntegerInRange,
  createSchemaReplayInput,
} from '../../util';
import { clampNumber, parseIntegerOrThrow } from '@gmjs/number-util';

export interface TwChartToolbarReplaySetBarIndexProps {
  readonly dataLength: number;
  readonly barIndex: number | undefined;
  readonly onBarIndexChange: (barIndex: number | undefined) => void;
}

export function TwChartToolbarReplaySetBarIndex({
  dataLength,
  barIndex,
  onBarIndexChange,
}: TwChartToolbarReplaySetBarIndexProps): React.ReactElement {
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
      onBarIndexChange(undefined);
      return;
    }

    if (!isReplayValueValid) {
      return;
    }

    const barIndexNum = parseIntegerOrThrow(barIndexInput);
    const newBarIndex = clampNumber(barIndexNum, 1, dataLength);

    onBarIndexChange(newBarIndex);
  }, [barIndexInput, dataLength, isReplayValueValid, onBarIndexChange]);

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
