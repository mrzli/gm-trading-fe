import {
  toBars,
  groupDataBars,
  aggregateGroupedDataBars,
  aggregateBars,
} from './process-chart-data';
import { FullBarData } from '../types';
import { BarReplayPosition, Bar, Bars, ChartResolution } from '../../../types';
import { applyFn } from '@gmjs/apply-function';
import { flatten, toArray } from '@gmjs/value-transformers';

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

export function getTradeData(data: FullBarData): Bars {
  return applyFn(data.subBars, flatten<Bar>(), toArray());
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
