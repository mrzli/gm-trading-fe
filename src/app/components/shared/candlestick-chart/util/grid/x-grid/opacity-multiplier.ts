import { TickerDataRow } from '../../../../../../types';

const TICKER_GRID_OPACITY_STEP = 0.1;

export function getXGridStrokeOpacity(
  data: readonly TickerDataRow[],
  index: number,
  getXGridMultiplier: (ts1: number, ts2: number) => number,
): number {
  if (index <= 0 || index >= data.length) {
    return TICKER_GRID_OPACITY_STEP;
  }

  const ts1 = data[index - 1]?.ts ?? 0;
  const ts2 = data[index]?.ts ?? 0;

  return TICKER_GRID_OPACITY_STEP * getXGridMultiplier(ts1, ts2);
}
