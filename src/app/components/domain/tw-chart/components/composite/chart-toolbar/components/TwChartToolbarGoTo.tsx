import React, { useCallback, useMemo, useState } from 'react';
import { TwRange } from '../../../../types';
import { logicalToLogicalRange, timeToLogical } from '../../../../util';
import { TwTextInput } from '../../../form/TwITextnput';
import { dateIsoUtcToUnixSeconds } from '../../../../../../../util';
import { TickerDataRow } from '../../../../../../../types';
import { SCHEME_GO_TO_INPUT, dateInputToIso, SCHEME_DATE } from '../util';

export interface TwChartToolbarGoToProps {
  readonly data: readonly TickerDataRow[];
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
    () => SCHEME_GO_TO_INPUT.safeParse(goToInput).success,
    [goToInput],
  );
  const isGoToEnabled = useMemo(
    () => SCHEME_DATE.safeParse(goToInput).success && data.length > 0,
    [goToInput, data],
  );

  const handleGoToClick = useCallback(() => {
    if (!isGoToEnabled) {
      return;
    }

    const time = dateIsoUtcToUnixSeconds(dateInputToIso(goToInput));
    const logical = timeToLogical(time, data);
    const newRange = logicalToLogicalRange(logical, logicalRange, data.length);

    onGoTo(newRange);
  }, [isGoToEnabled, goToInput, data, logicalRange, onGoTo]);

  const handleGoToKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        handleGoToClick();
      }
    },
    [handleGoToClick],
  );

  return (
    <div className='inline-flex flex-row gap-0.5'>
      <TwTextInput
        placeholder='YYYY-MM-DD [HH:mm]'
        value={goToInput}
        onValueChange={setGoToInput}
        onKeyDown={handleGoToKeyDown}
        error={!isGoToInputValid}
        width={160}
      />
      {/* <TwButton
        content={'Go to'}
        onClick={handleGoToClick}
        disabled={!isGoToEnabled}
      /> */}
    </div>
  );
}
