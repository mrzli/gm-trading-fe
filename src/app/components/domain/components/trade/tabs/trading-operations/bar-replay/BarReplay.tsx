import React, { useCallback, useMemo, useState } from 'react';
import {
  BarReplayPosition,
  ChartTimezone,
  GroupedBars,
} from '../../../../../types';
import { BarReplaySetBarIndex } from './BarReplaySetBarIndex';
import { BarReplayNavigateBar } from './BarReplayNavigateBar';
import { BarReplayNavigateSubBar } from './BarReplayNavigateSubBar';
import {
  SCHEMA_DATE_FOR_INPUT,
  SCHEMA_DATE_INPUT,
  binarySearch,
  dateInputToIso,
} from '../../../../../util';
import { TextInput } from '../../../../../../shared';
import { dateIsoToUnixSeconds } from '../../../../../../../util';

export interface BarReplayProps {
  readonly timezone: ChartTimezone;
  readonly subBars: GroupedBars;
  readonly replayPosition: BarReplayPosition;
  readonly onReplayPositionChange: (position: BarReplayPosition) => void;
}

export function BarReplay({
  timezone,
  subBars,
  replayPosition,
  onReplayPositionChange,
}: BarReplayProps): React.ReactElement {
  const [goToInput, setGoToInput] = useState('');
  const isGoToInputValid = useMemo(
    () => SCHEMA_DATE_INPUT.safeParse(goToInput).success,
    [goToInput],
  );
  const isGoToValid = useMemo(
    () =>
      SCHEMA_DATE_FOR_INPUT.safeParse(goToInput).success && subBars.length > 0,
    [goToInput, subBars],
  );

  const handleGoToInputKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        if (!isGoToValid) {
          return;
        }

        const time = dateIsoToUnixSeconds(dateInputToIso(goToInput), timezone);
        const barIndex = binarySearch(subBars, time, (item) => item[0].time);
        if (barIndex === replayPosition.barIndex) {
          return;
        }

        onReplayPositionChange({ barIndex, subBarIndex: 0 });
      }
    },
    [
      goToInput,
      isGoToValid,
      onReplayPositionChange,
      replayPosition.barIndex,
      subBars,
      timezone,
    ],
  );

  return (
    <div className='inline-flex flex-row gap-0.5'>
      <BarReplaySetBarIndex
        dataLength={subBars.length}
        barIndex={replayPosition.barIndex}
        onReplayPositionChange={onReplayPositionChange}
      />
      <BarReplayNavigateBar
        dataLength={subBars.length}
        barIndex={replayPosition.barIndex}
        onReplayPositionChange={onReplayPositionChange}
      />
      <BarReplayNavigateSubBar
        subBars={subBars}
        barIndex={replayPosition.barIndex}
        subBarIndex={replayPosition.subBarIndex}
        onReplayPositionChange={onReplayPositionChange}
      />
      <TextInput
        placeholder='YYYY-MM-DD [HH:mm]'
        value={goToInput}
        onValueChange={setGoToInput}
        onKeyDown={handleGoToInputKeyDown}
        error={!isGoToInputValid}
        width={160}
      />
    </div>
  );
}
