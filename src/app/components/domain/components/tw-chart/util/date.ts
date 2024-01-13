import {
  DateObjectTz,
  dateObjectTzToUnixSeconds,
  unixSecondsToDateObjectTz,
} from '@gmjs/date-util';
import { Bars } from '../../../types';
import { UTCTimestamp } from 'lightweight-charts';

// tradingview lightweight-charts uses timestamps in UTC
// this function is used to adjust timestamp so that the chart
//   (visually) displays time in the correct timezone
// to do this, actual timestamp is adjusted by the timezone offset
// for example:
//   - timestamp (seconds) 1704110400 is 2024-01-01T12:00:00.000Z
//   - the above would display 12:00 on the chart
//   - if I put the timezone to Europe/Berlin, the chart would need to display 13:00
//   - to fake that, we need a timestamp of 1704114000, or 2024-01-01T13:00:00.000Z
// process is:
//   - convert timestamp to DateObjectTz,
//     which will represent that same time point in the zone Europe/Berlin
//   - it will have a timestamp 1704110400, and time of 2024-01-01T13:00:00.000+01:00
//   - then we (re-)set the zone to UTC, and but keep the local time (meaning hour 13)
//   - the resulting time is 2024-01-01T13:00:00.000Z, and the timestamp is 1704114000
export function utcToTzTimestamp(timestamp: number, timezone: string): number {
  const dateObject = unixSecondsToDateObjectTz(timestamp, timezone);
  const adjustedDateObject: DateObjectTz = {
    ...dateObject,
    timezone: 'UTC',
  };
  return dateObjectTzToUnixSeconds(adjustedDateObject);
}

// inverse of the above operation
export function tzToUtcTimestamp(timestamp: number, timezone: string): number {
  const dateObject = unixSecondsToDateObjectTz(timestamp, 'UTC');
  const adjustedDateObject: DateObjectTz = {
    ...dateObject,
    timezone,
  };
  return dateObjectTzToUnixSeconds(adjustedDateObject);
}

export function utcToTzTimestampForBars(bars: Bars, timezone: string): Bars {
  const firstBarTime = bars[0].time;
  const firstBarChangedTime = utcToTzTimestamp(firstBarTime, timezone);
  const timeAdjustment = firstBarChangedTime - firstBarTime;

  return bars.map((bar) => {
    return {
      ...bar,
      time: (bar.time + timeAdjustment) as UTCTimestamp,
    };
  });
}

export function tzToUtcTimestampForBars(bars: Bars, timezone: string): Bars {
  const firstBarTime = bars[0].time;
  const firstBarChangedTime = tzToUtcTimestamp(firstBarTime, timezone);
  const timeAdjustment = firstBarChangedTime - firstBarTime;

  return bars.map((bar) => {
    return {
      ...bar,
      time: (bar.time + timeAdjustment) as UTCTimestamp,
    };
  });
}
