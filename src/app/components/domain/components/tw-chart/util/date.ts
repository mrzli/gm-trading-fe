import { DateTime } from 'luxon';
import { ChartTimezone } from '../../../types';
import { Time, isUTCTimestamp, isBusinessDay } from 'lightweight-charts';

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
//   - convert timestamp to luxon DateTime, to the zone Europe/Berlin
//   - it will have a timestamp 1704110400, and time of 2024-01-01T13:00:00.000+01:00
//   - then we set the zone to UTC, and but keep the local time (meaning hour 13)
//   - the resulting time is 2024-01-01T13:00:00.000Z, and the timestamp is 1704114000
export function utcToTzTimestamp(
  timestamp: number,
  timezone: ChartTimezone,
): number {
  const dateTime = DateTime.fromSeconds(timestamp, { zone: timezone });
  const result = dateTime.setZone('UTC', { keepLocalTime: true }).toSeconds();
  return result;
}

// function twTimeToTimestamp(time: Time): number {
//   if (isUTCTimestamp(time)) {
//     return time;
//   } else if (isBusinessDay(time)) {
//     return new Date(time.year, time.month, time.day);
//   } else {
//     return new Date(time);
//   }
// }
