import React, { useCallback, useMemo, useState } from 'react';
import { TwRange } from '../../../types';
import { logicalToLogicalRange, timeToLogical } from '../../../util';
import { TextInput } from '../../../../../shared';
import { dateIsoUtcToUnixSeconds } from '../../../../../../util';
import { TickerDataRows } from '../../../../types';
import { SCHEMA_GO_TO_INPUT, dateInputToIso, SCHEMA_GO_TO_DATE } from '../util';

export interface TwChartToolbarGoToProps {
  readonly data: TickerDataRows;
  readonly logicalRange: TwRange | undefined;
  readonly onGoTo: (logicalRange: TwRange) => void;
}

export function TwChartToolbarGoTo({
  data,
  logicalRange,
  onGoTo,
}: TwChartToolbarGoToProps): React.ReactElement {
  const [goToInput, setGoToInput] = useState('');
  const isGoToInputValid = useMemo(
    () => SCHEMA_GO_TO_INPUT.safeParse(goToInput).success,
    [goToInput],
  );
  const isGoToValid = useMemo(
    () => SCHEMA_GO_TO_DATE.safeParse(goToInput).success && data.length > 0,
    [goToInput, data],
  );

  const handleGoToClick = useCallback(() => {
    if (!isGoToValid) {
      return;
    }

    const time = dateIsoUtcToUnixSeconds(dateInputToIso(goToInput));
    const logical = timeToLogical(time, data);
    const newRange = logicalToLogicalRange(logical, logicalRange, data.length);

    onGoTo(newRange);
  }, [isGoToValid, goToInput, data, logicalRange, onGoTo]);

  const handleGoToInputKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
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
