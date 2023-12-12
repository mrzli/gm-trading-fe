export const TYPES_OF_TIME_STEP_SELECTIONS = [
  '1B',
  '10B',
  '100B',
  '1000B',
  '1h',
  '4h',
  '1D',
  '1W',
  '1M',
] as const;

export type TwTimeStepSelection =
  (typeof TYPES_OF_TIME_STEP_SELECTIONS)[number];
