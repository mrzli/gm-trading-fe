import { DateTime } from 'luxon';
import { ChartTimezone } from '../../../types';

export function utcToTzTimestamp(
  timestamp: number,
  timezone: ChartTimezone,
): number {
  const dateTime = DateTime.fromSeconds(timestamp, { zone: timezone });
  const result = dateTime.setZone('UTC', { keepLocalTime: true }).toSeconds();
  return result;
}
