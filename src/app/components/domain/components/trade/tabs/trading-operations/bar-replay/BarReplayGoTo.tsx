import React, { useCallback, useMemo, useState } from 'react';
import { dateIsoToUnixSeconds } from '../../../../../../../util';
import { TextInput } from '../../../../../../shared';
import {
  SCHEMA_DATE_INPUT,
  SCHEMA_DATE_FOR_INPUT,
  dateInputToIso,
  binarySearch,
} from '../../../../../util';
import {
  ChartTimezone,
  GroupedBars,
  BarReplayPosition,
} from '../../../../../types';

export interface BarReplayGoToProps {
  readonly timezone: ChartTimezone;
  readonly subBars: GroupedBars;
  readonly replayPosition: BarReplayPosition;
  readonly onReplayPositionChange: (position: BarReplayPosition) => void;
}

export function BarReplayGoTo({
  timezone,
  subBars,
  replayPosition,
  onReplayPositionChange,
}: BarReplayGoToProps): React.ReactElement {
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
