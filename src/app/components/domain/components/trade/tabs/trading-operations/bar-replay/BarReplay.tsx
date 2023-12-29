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
  isBarReplayPositionEqual,
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
  const handleBarIndexChange = useCallback(
    (barIndex: number | undefined, subBarIndex: number = 0) => {
      const newBarReplayPosition: BarReplayPosition = {
        barIndex,
        subBarIndex,
      };

      if (isBarReplayPositionEqual(replayPosition, newBarReplayPosition)) {
        return;
      }

      onReplayPositionChange(newBarReplayPosition);
    },
    [onReplayPositionChange, replayPosition],
  );

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

        handleBarIndexChange(barIndex);
      }
    },
    [
      goToInput,
      handleBarIndexChange,
      isGoToValid,
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
        onBarIndexChange={handleBarIndexChange}
      />
      <BarReplayNavigateBar
        dataLength={subBars.length}
        barIndex={replayPosition.barIndex}
        onBarIndexChange={handleBarIndexChange}
      />
      <BarReplayNavigateSubBar
        subBars={subBars}
        barIndex={replayPosition.barIndex}
        subBarIndex={replayPosition.subBarIndex}
        onBarIndexChange={handleBarIndexChange}
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
