import {
  toBars,
  groupDataBars,
  aggregateGroupedDataBars,
  aggregateBars,
} from './process-chart-data';
import { FullBarData } from '../types';
import { BarReplayPosition, Bars, ChartResolution } from '../../../types';

export function rawDataToFullBarData(
  rawData: readonly string[] | undefined,
  resolution: ChartResolution,
): FullBarData {
  const nonAggregatedBarss = toBars(rawData ?? []);
  const subBars = groupDataBars(nonAggregatedBarss, resolution);
  const bars = aggregateGroupedDataBars(subBars);
  return {
    subBars,
    bars,
  };
}

export function getChartData(
  data: FullBarData,
  replayPosition: BarReplayPosition,
): Bars {
  const { subBars, bars } = data;
  const { barIndex, subBarIndex } = replayPosition;

  if (barIndex === undefined) {
    return bars;
  }

  const fullBars = bars.slice(0, barIndex);
  if (subBarIndex === 0) {
    return fullBars;
  } else {
    const lastBar = aggregateBars(subBars[barIndex].slice(0, subBarIndex));
    return [...fullBars, lastBar];
  }
}
