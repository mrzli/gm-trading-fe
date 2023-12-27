export const TYPES_OF_TW_CHART_RESOLUTION = [
  '1m',
  '2m',
  '5m',
  '10m',
  '15m',
  '30m',
  '1h',
  '2h',
  '4h',
  'D',
  'W',
  'M',
] as const;

export type TwChartResolution = (typeof TYPES_OF_TW_CHART_RESOLUTION)[number];
