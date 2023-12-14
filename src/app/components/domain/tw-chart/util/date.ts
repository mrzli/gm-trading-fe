import { DateTime } from 'luxon';
import { TwChartTimezone } from '../types';

export function utcToTzTimestamp(
  timestamp: number,
  timezone: TwChartTimezone,
): number {
  const dateTime = DateTime.fromSeconds(timestamp, { zone: timezone });
  const result = dateTime.setZone('UTC', { keepLocalTime: true }).toSeconds();
  return result;
}
