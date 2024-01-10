import React, { useCallback, useMemo } from 'react';
import { BarReplayPosition, Bars } from '../../../../../types';
import { Instrument } from '@gmjs/gm-trading-shared';
import { Button } from '../../../../../../shared';
import {
  DateObjectTz,
  dateObjectTzAdd,
  dateObjectTzToUnixSeconds,
  unixSecondsToDateObjectTz,
} from '@gmjs/date-util';
import {
  binarySearch,
  dateObjectTzToWeekday,
  getHourMinute,
} from '../../../../../util';

export interface BarReplayNavigateSessionProps {
  readonly instrument: Instrument;
  readonly bars: Bars;
  readonly replayPosition: BarReplayPosition;
  readonly onReplayPositionChange: (position: BarReplayPosition) => void;
}

export function BarReplayNavigateSession({
  instrument,
  bars,
  replayPosition,
  onReplayPositionChange,
}: BarReplayNavigateSessionProps): React.ReactElement {
  const { barIndex } = replayPosition;

  const prevSessionOpenTime = useMemo(() => {
    return barIndex === undefined
      ? undefined
      : getPrevOpenTime(bars[barIndex].time, instrument);
  }, [barIndex, bars, instrument]);

  const prevSessionOpenBarIndex = useMemo(() => {
    return getSessionOpenBarIndex(bars, prevSessionOpenTime);
  }, [prevSessionOpenTime, bars]);

  const nextSessionOpenTime = useMemo(() => {
    return barIndex === undefined
      ? undefined
      : getNextOpenTime(bars[barIndex].time, instrument);
  }, [barIndex, bars, instrument]);

  const nextSessionOpenBarIndex = useMemo(() => {
    return getSessionOpenBarIndex(bars, nextSessionOpenTime);
  }, [nextSessionOpenTime, bars]);

  const handlePreviousOpenClick = useCallback(() => {
    if (prevSessionOpenBarIndex === undefined) {
      return;
    }

    onReplayPositionChange({
      barIndex: prevSessionOpenBarIndex,
      subBarIndex: 0,
    });
  }, [onReplayPositionChange, prevSessionOpenBarIndex]);

  const handleNextOpenClick = useCallback(() => {
    if (nextSessionOpenBarIndex === undefined) {
      return;
    }

    onReplayPositionChange({
      barIndex: nextSessionOpenBarIndex,
      subBarIndex: 0,
    });
  }, [nextSessionOpenBarIndex, onReplayPositionChange]);

  return (
    <div className='grid grid-cols-2 gap-0.5'>
      <Button
        content={'<PO'}
        onClick={handlePreviousOpenClick}
        disabled={prevSessionOpenBarIndex === undefined}
      />
      <Button
        content={'NO>'}
        onClick={handleNextOpenClick}
        disabled={nextSessionOpenBarIndex === undefined}
      />
    </div>
  );
}

function getPrevOpenTime(currentTime: number, instrument: Instrument): number {
  const { timezone: instrumentTimezone, openTime } = instrument;
  const dateObject = unixSecondsToDateObjectTz(currentTime, instrumentTimezone);
  const [openHour, openMinute] = getHourMinute(openTime);

  const dayChange = getPrevOpenTimeDayChange(dateObject, openHour, openMinute);
  const openDay = dateObjectTzAdd(dateObject, { days: dayChange });
  const openDateObject: DateObjectTz = {
    ...openDay,
    hour: openHour,
    minute: openMinute,
    second: 0,
    millisecond: 0,
  };
  return dateObjectTzToUnixSeconds(openDateObject);
}

function getPrevOpenTimeDayChange(
  dateObject: DateObjectTz,
  openHour: number,
  openMinute: number,
): number {
  const { hour, minute } = dateObject;
  const weekday = dateObjectTzToWeekday(dateObject);

  if (weekday > 5) {
    return 5 - weekday;
  } else if (hour < openHour || (hour === openHour && minute <= openMinute)) {
    return weekday === 1 ? -3 : -1;
  } else {
    return 0;
  }
}

function getNextOpenTime(currentTime: number, instrument: Instrument): number {
  const { timezone: instrumentTimezone, openTime } = instrument;
  const dateObject = unixSecondsToDateObjectTz(currentTime, instrumentTimezone);
  const [openHour, openMinute] = getHourMinute(openTime);

  const dayChange = getNextOpenTimeDayChange(dateObject, openHour, openMinute);
  const openDay = dateObjectTzAdd(dateObject, { days: dayChange });
  const openDateObject: DateObjectTz = {
    ...openDay,
    hour: openHour,
    minute: openMinute,
    second: 0,
    millisecond: 0,
  };
  return dateObjectTzToUnixSeconds(openDateObject);
}

function getNextOpenTimeDayChange(
  dateObject: DateObjectTz,
  openHour: number,
  openMinute: number,
): number {
  const { hour, minute } = dateObject;
  const weekday = dateObjectTzToWeekday(dateObject);

  if (weekday > 5) {
    return 8 - weekday;
  } else if (hour > openHour || (hour === openHour && minute >= openMinute)) {
    return weekday === 5 ? 3 : 1;
  } else {
    return 0;
  }
}

function getSessionOpenBarIndex(
  bars: Bars,
  time: number | undefined,
): number | undefined {
  if (time === undefined) {
    return undefined;
  }

  if (bars.length === 0 || time < bars[0].time || time > bars.at(-1)!.time) {
    return undefined;
  }

  return binarySearch(bars, time, (item) => item.time);
}
