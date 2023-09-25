import { parseIntegerOrThrow } from '@gmjs/number-util';
import { invariant } from '@gmjs/assert';
import { DateTime } from 'luxon';
import { HourMinute } from '../types';

export function dateIsoToUnixMillis(dateIso: string): number {
  return DateTime.fromISO(dateIso).toMillis();
}

export function timestampToDatetimeUtc(ts: number): DateTime {
  return DateTime.fromSeconds(ts).setZone('UTC');
}

export function timestampToIsoDatetime(ts: number): string {
  const result = timestampToDatetimeUtc(ts).toISO({ suppressMilliseconds: true });
  invariant(result !== null, 'Invalid timestamp.');
  return result;
}

export function timestampToIsoDate(ts: number): string {
  const result = timestampToDatetimeUtc(ts).toISODate();
  invariant(result !== null, 'Invalid timestamp.');
  return result;
}

export function dateIsoToHourMinuteUtc(dateIso: string): string {
  return DateTime.fromISO(dateIso).setZone('UTC').toFormat('HH:mm');
}

export function getTimestampAtTimeAndZone(
  dayTimestamp: number,
  time: string,
  timezone: string
): number {
  const { hour, minute } = timeToHourMinute(time);
  const date = timestampToDatetimeUtc(dayTimestamp)
    .setZone(timezone)
    .set({ hour, minute, second: 0, millisecond: 0 });
  return date.toSeconds();
}

function timeToHourMinute(time: string): HourMinute {
  const parts = time.split(':');
  return {
    hour: parseIntegerOrThrow(parts[0] ?? ''),
    minute: parseIntegerOrThrow(parts[1] ?? ''),
  };
}

