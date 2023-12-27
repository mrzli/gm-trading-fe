export interface TwTimeStep {
  readonly unit: TwTimeStepUnit;
  readonly value: number;
}

export const TYPES_OF_TIME_STEP_UNITS = ['B', 'h', 'D', 'W', 'M'] as const;

export type TwTimeStepUnit = (typeof TYPES_OF_TIME_STEP_UNITS)[number];
