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

export function getPrevOpenTime(currentTime: number, instrument: Instrument): number {
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

export function getNextOpenTime(currentTime: number, instrument: Instrument): number {
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

export function getSessionOpenBarIndex(
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
