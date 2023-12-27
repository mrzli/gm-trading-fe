import { BarReplayPosition } from '../types';

export function isBarReplayPositionEqual(
  a: BarReplayPosition,
  b: BarReplayPosition,
): boolean {
  return a.barIndex === b.barIndex && a.subBarIndex === b.subBarIndex;
}
