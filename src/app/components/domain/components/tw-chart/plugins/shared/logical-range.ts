import { Range } from 'lightweight-charts';
import { ChartSeriesApi, ChartTimeScaleApi } from '../types';
import { ChartBars } from '../../types';

export function getVisibleData(series: ChartSeriesApi, range: Range<number>): ChartBars {
  const { from, to } = range;
  return series.data().slice(from, to + 1) as unknown as ChartBars;
}

export function getVisibleBarIndexRange(
  timeScale: ChartTimeScaleApi,
): Range<number> | undefined {
  const logicalRange = timeScale.getVisibleLogicalRange() ?? undefined;
  if (!logicalRange) {
    return undefined;
  }

  const fromIndex = Math.max(0, Math.floor(logicalRange.from));
  const toIndex = Math.max(0, Math.ceil(logicalRange.to));

  return { from: fromIndex, to: toIndex };
}
