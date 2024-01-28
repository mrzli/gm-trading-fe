import React, { useCallback, useMemo, useState } from 'react';
import { dateObjectTzToUnixSeconds } from '@gmjs/date-util';
import { TextInput } from '../../../../shared';
import {
  ChartTimezone,
  ChartNavigatePayloadAny,
  ChartNavigatePayloadGoTo,
} from '../../../types';
import {
  SCHEMA_DATE_FOR_INPUT,
  SCHEMA_DATE_INPUT,
  dateInputToDateObjectTz,
} from '../../../util';

export interface ChartToolbarGoToProps {
  readonly timezone: ChartTimezone;
  readonly onGoTo: (payload: ChartNavigatePayloadAny) => void;
}

export function ChartToolbarGoTo({
  timezone,
  onGoTo,
}: ChartToolbarGoToProps): React.ReactElement {
  const [goToInput, setGoToInput] = useState('');
  const isGoToInputValid = useMemo(
    () => SCHEMA_DATE_INPUT.safeParse(goToInput).success,
    [goToInput],
  );
  const isGoToValid = useMemo(
    () => SCHEMA_DATE_FOR_INPUT.safeParse(goToInput).success,
    [goToInput],
  );

  const handleGoToClick = useCallback(() => {
    if (!isGoToValid) {
      return;
    }

    const time = dateObjectTzToUnixSeconds(
      dateInputToDateObjectTz(goToInput, timezone),
    );

    const payload: ChartNavigatePayloadGoTo = {
      type: 'go-to',
      time,
    };

    onGoTo(payload);
  }, [isGoToValid, goToInput, timezone, onGoTo]);

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
