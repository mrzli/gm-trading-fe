import { TickerDataResolution } from '@gmjs/gm-trading-shared';
import { TickerDataRow } from '../../../../../types';
import { AxisTickItem } from '../../types';

export function getXAxisTicks(
  resolution: TickerDataResolution,
  normalizedData: readonly TickerDataRow[],
  xNormalizedOffset: number, // (-Inf, 1)
  slotWidth: number,
  chartWidth: number,
): readonly AxisTickItem[] {
  const firstX = -xNormalizedOffset * slotWidth;
  const ticks: AxisTickItem[] = [];

  for (const [i, item] of normalizedData.entries()) {
    const currX = firstX + i * slotWidth;
    if (currX > chartWidth + 0.001) {
      break;
    }

    const textLines: readonly string[] = ['00:00'];
    const tick: AxisTickItem = {
      offset: currX,
      textLines,
    };
    ticks.push(tick);
  }

  // remove first tick if it's not visible (when xNormalizedOffset > 0)
  const finalTicks = xNormalizedOffset > 0 ? ticks.slice(1) : ticks;

  return finalTicks;
}
