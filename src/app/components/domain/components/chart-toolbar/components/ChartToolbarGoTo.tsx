import React, { useCallback, useMemo, useState } from 'react';
import {
  dateObjectTzToUnixSeconds,
} from '@gmjs/date-util';
import { TextInput } from '../../../../shared';
import { ChartRange, Bars, ChartTimezone } from '../../../types';
import { timeToLogical, logicalToLogicalRange } from '../util';
import {
  SCHEMA_DATE_FOR_INPUT,
  SCHEMA_DATE_INPUT,
  dateInputToDateObjectTz,
  isChartRangeEqual,
} from '../../../util';

export interface ChartToolbarGoToProps {
  readonly timezone: ChartTimezone;
  readonly data: Bars;
  readonly logicalRange: ChartRange | undefined;
  readonly onGoTo: (logicalRange: ChartRange) => void;
}

export function ChartToolbarGoTo({
  timezone,
  data,
  logicalRange,
  onGoTo,
}: ChartToolbarGoToProps): React.ReactElement {
  const [goToInput, setGoToInput] = useState('');
  const isGoToInputValid = useMemo(
    () => SCHEMA_DATE_INPUT.safeParse(goToInput).success,
    [goToInput],
  );
  const isGoToValid = useMemo(
    () => SCHEMA_DATE_FOR_INPUT.safeParse(goToInput).success && data.length > 0,
    [goToInput, data],
  );

  const handleGoToClick = useCallback(() => {
    if (!isGoToValid) {
      return;
    }

    const time = dateObjectTzToUnixSeconds(
      dateInputToDateObjectTz(goToInput, timezone),
    );
    const logical = timeToLogical(time, data);
    const newRange = logicalToLogicalRange(logical, logicalRange, data.length);
    if (isChartRangeEqual(newRange, logicalRange)) {
      return;
    }

    onGoTo(newRange);
  }, [isGoToValid, goToInput, timezone, data, logicalRange, onGoTo]);

  const handleGoToInputKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter') {
        handleGoToClick();
      }
    },
    [handleGoToClick],
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
      {/* <Button
        content={'Go to'}
        onClick={handleGoToClick}
        disabled={!isGoToEnabled}
      /> */}
    </div>
  );
}
