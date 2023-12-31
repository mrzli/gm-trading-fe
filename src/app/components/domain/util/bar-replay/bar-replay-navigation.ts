import { clamp } from '@gmjs/number-util';
import { BarReplayIndexes, GroupedBars } from '../../types';

export function barReplayMoveSubBar(
  subBars: GroupedBars,
  barIndex: number,
  subBarIndex: number,
  subBarMoveAmount: number,
): BarReplayIndexes {
  let newBarIndex = barIndex;
  let newSubBarIndex = subBarIndex + subBarMoveAmount;

  while (newBarIndex > 1 && newSubBarIndex < 0) {
    newBarIndex--;
    newSubBarIndex += subBars[newBarIndex].length;
  }

  while (
    newBarIndex < subBars.length &&
    newSubBarIndex >= subBars[newBarIndex].length
  ) {
    newSubBarIndex -= subBars[newBarIndex].length;
    newBarIndex++;
  }

  newBarIndex = clamp(newBarIndex, 1, subBars.length);
  newSubBarIndex =
    newBarIndex === subBars.length
      ? 0
      : clamp(newSubBarIndex, 0, subBars[newBarIndex].length - 1);

  return { barIndex: newBarIndex, subBarIndex: newSubBarIndex };
}
