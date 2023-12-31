import React, { useCallback, useMemo, useState } from 'react';
import { dateIsoToUnixSeconds } from '../../../../../../../util';
import {
  SelectButton,
  SelectOption,
  TextInput,
} from '../../../../../../shared';
import {
  SCHEMA_DATE_INPUT,
  SCHEMA_DATE_FOR_INPUT,
  dateInputToIso,
  binarySearch,
  toSimpleSelectOption,
} from '../../../../../util';
import {
  ChartTimezone,
  GroupedBars,
  BarReplayPosition,
  TYPES_OF_CHART_TIMEZONES,
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

  const [navigationTimezone, setNavigationTimezone] =
    useState<TimezoneOrCurrent>('current-tz');

  const finalTimezone = useMemo<ChartTimezone>(() => {
    return navigationTimezone === 'current-tz' ? timezone : navigationTimezone;
  }, [navigationTimezone, timezone]);

  const handleGoToInputKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        if (!isGoToValid) {
          return;
        }

        const time = dateIsoToUnixSeconds(
          dateInputToIso(goToInput),
          finalTimezone,
        );
        const barIndex = binarySearch(subBars, time, (item) => item[0].time);
        if (barIndex === replayPosition.barIndex) {
          return;
        }

        onReplayPositionChange({ barIndex, subBarIndex: 0 });
      }
    },
    [
      finalTimezone,
      goToInput,
      isGoToValid,
      onReplayPositionChange,
      replayPosition.barIndex,
      subBars,
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
      <SelectButton<TimezoneOrCurrent, false>
        options={TIMEZONE_OPTIONS}
        value={navigationTimezone}
        onValueChange={setNavigationTimezone}
        selectionWidth={128}
        selectItemWidth={128}
      />
    </div>
  );
}

const TIMEZONE_OR_CURRENT = [
  'current-tz',
  ...TYPES_OF_CHART_TIMEZONES,
] as const;

type TimezoneOrCurrent = (typeof TIMEZONE_OR_CURRENT)[number];

const TIMEZONE_OPTIONS: readonly SelectOption<TimezoneOrCurrent>[] =
  TIMEZONE_OR_CURRENT.map((timezone) => toSimpleSelectOption(timezone));
