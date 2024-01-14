import { Bars } from '../../../../types';
import { ChartTimeScaleApi } from '../types';

const DEFAULT_BAR_WIDTH = 6;

export function getBarWidth(
  visibleData: Bars,
  timeScale: ChartTimeScaleApi,
): number {
  if (visibleData.length < 2) {
    return DEFAULT_BAR_WIDTH;
  }

  const firstBarX = timeScale.timeToCoordinate(visibleData[0].time);
  const secondBarX = timeScale.timeToCoordinate(visibleData[1].time);
  if (firstBarX === null || secondBarX === null) {
    return DEFAULT_BAR_WIDTH;
  }

  return secondBarX - firstBarX;
}
