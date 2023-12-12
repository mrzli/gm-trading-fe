export const TYPES_OF_TIME_STEPS = [
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

export type TwTimeStep = (typeof TYPES_OF_TIME_STEPS)[number];
