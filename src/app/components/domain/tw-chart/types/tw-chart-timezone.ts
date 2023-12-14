export const TYPES_OF_TW_CHART_TIMEZONES = [
  'UTC',
  'Europe/Berlin',
  'Europe/London',
  'America/New_York',
  'Asia/Tokyo',
] as const;

export type TwChartTimezone = (typeof TYPES_OF_TW_CHART_TIMEZONES)[number];
