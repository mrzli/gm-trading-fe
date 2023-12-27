export interface ChartTimeStep {
  readonly unit: ChartTimeStepUnit;
  readonly value: number;
}

export const TYPES_OF_CHART_TIME_STEP_UNITS = [
  'B',
  'h',
  'D',
  'W',
  'M',
] as const;

export type ChartTimeStepUnit = (typeof TYPES_OF_CHART_TIME_STEP_UNITS)[number];
