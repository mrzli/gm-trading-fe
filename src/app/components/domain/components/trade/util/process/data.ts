import { applyFn } from '@gmjs/apply-function';
import { flatten, toArray } from '@gmjs/value-transformers';
import { GroupedBars, Bars, Bar, BarReplayPosition } from '../../../../types';
import { FullBarData } from '../../../ticker-data-container/types';

export function flattenGroupedBars(data: GroupedBars): Bars {
  return applyFn(data, flatten<Bar>(), toArray());
}

export function getTradeDataBarIndex(
  data: FullBarData,
  replayPosition: BarReplayPosition,
): number {
  const { barIndex, subBarIndex } = replayPosition;
  if (barIndex === undefined) {
    return 0;
  }

  let tradeDataBarIndex = 0;
  for (let i = 0; i < barIndex; i++) {
    tradeDataBarIndex += data.subBars[i].length;
  }
  tradeDataBarIndex += subBarIndex;

  return tradeDataBarIndex;
}
