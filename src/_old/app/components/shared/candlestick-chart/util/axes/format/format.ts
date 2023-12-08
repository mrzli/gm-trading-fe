import { DateTime } from 'luxon';

export function timestampToYear(seconds: number, timezone: string): string {
  const dt = DateTime.fromSeconds(seconds, { zone: timezone });
  return dt.toFormat('yyyy');
}

export function timestampToMonth(seconds: number, timezone: string): string {
  const dt = DateTime.fromSeconds(seconds, { zone: timezone });
  return dt.toFormat('MMM');
}

export function timestampToDay(seconds: number, timezone: string): string {
  const dt = DateTime.fromSeconds(seconds, { zone: timezone });
  return dt.toFormat('d');
}

export function timestampToTime(seconds: number, timezone: string): string {
  const dt = DateTime.fromSeconds(seconds, { zone: timezone });
  return dt.toFormat('HH:mm');
}
