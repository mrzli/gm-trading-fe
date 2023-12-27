export const TYPES_OF_CHART_RESOLUTIONS = [
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

export type ChartResolution = (typeof TYPES_OF_CHART_RESOLUTIONS)[number];
