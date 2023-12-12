import { DateTime } from 'luxon';

export function dateIsoUtcToUnixMillis(dateIso: string): number {
  return DateTime.fromISO(dateIso, { zone: 'UTC' }).toMillis();
}

export function dateIsoUtcToUnixSeconds(dateIso: string): number {
  return DateTime.fromISO(dateIso, { zone: 'UTC' }).toSeconds();
}
