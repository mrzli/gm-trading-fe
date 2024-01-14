import {
  unixSecondsToDateObjectTz,
  dateObjectTzAdd,
  DateObjectTz,
  dateObjectTzToUnixSeconds,
} from '@gmjs/date-util';
import { Instrument } from '@gmjs/gm-trading-shared';
import { Bars } from '../../../../../../types';
import {
  getHourMinute,
  dateObjectTzToWeekday,
  binarySearch,
} from '../../../../../../util';

export function getBarIndexPrevSessionOpen(
  instrument: Instrument,
  bars: Bars,
  barIndex: number,
): number {
  const currentTime = bars[barIndex].time;

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

  const newTime = dateObjectTzToUnixSeconds(openDateObject);
  return timeToBarIndex(newTime, bars);
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

export function getBarIndexNextSessionOpen(
  instrument: Instrument,
  bars: Bars,
  barIndex: number,
): number {
  const currentTime = bars[barIndex].time;

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
  const newTime = dateObjectTzToUnixSeconds(openDateObject);
  return timeToBarIndex(newTime, bars);
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

function timeToBarIndex(time: number, bars: Bars): number {
  return binarySearch(bars, time, (item) => item.time);
}
