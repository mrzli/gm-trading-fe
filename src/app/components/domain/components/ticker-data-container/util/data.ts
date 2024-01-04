import {
  toBars,
  groupDataBars,
  aggregateGroupedDataBars,
  aggregateBars,
} from './process-chart-data';
import { FullBarData } from '../types';
import { Bar, BarReplayPosition, Bars, ChartResolution } from '../../../types';
import { createAfterLastBar } from '../../../util';

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
  resolution: ChartResolution,
): Bars {
  const { subBars, bars } = data;
  const { barIndex, subBarIndex } = replayPosition;

  if (barIndex === undefined) {
    return bars;
  }

  const fullBars = bars.slice(0, barIndex);
  if (subBarIndex === 0) {
    const lastBarOpen = createReplayBarLastOpen(bars, barIndex, resolution);
    return [...fullBars, lastBarOpen];
  } else {
    const currentSubBars = subBars[barIndex];
    const lastBarOpen = createReplayBarLastOpen(
      currentSubBars,
      subBarIndex,
      resolution,
    );
    const replaySubBars = [
      ...currentSubBars.slice(0, subBarIndex),
      lastBarOpen,
    ];
    const lastBar = aggregateBars(replaySubBars);
    return [...fullBars, lastBar];
  }
}

function createReplayBarLastOpen(
  bars: Bars,
  barIndex: number,
  resolution: ChartResolution,
): Bar {
  const currentReplayBar = bars[barIndex];

  if (barIndex === bars.length) {
    return createAfterLastBar(bars[barIndex - 1], resolution);
  }

  return {
    time: currentReplayBar.time,
    open: currentReplayBar.open,
    high: currentReplayBar.open,
    low: currentReplayBar.open,
    close: currentReplayBar.open,
  };
}
