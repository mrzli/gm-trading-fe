import {
  toBars,
  groupDataRows,
  aggregateGroupedDataRows,
  aggregateRows,
} from './process-chart-data';
import { FullBarData } from '../types';
import { BarReplayPosition, Bar, Bars, ChartResolution } from '../../../types';
import { applyFn } from '@gmjs/apply-function';
import { flatten, toArray } from '@gmjs/value-transformers';

export function rawDataToFullBarData(
  rawData: readonly string[] | undefined,
  resolution: ChartResolution,
): FullBarData {
  const nonAggregatedRows = toBars(rawData ?? []);
  const subRows = groupDataRows(nonAggregatedRows, resolution);
  const rows = aggregateGroupedDataRows(subRows);
  return {
    subRows,
    rows,
  };
}

export function getChartData(
  data: FullBarData,
  replayPosition: BarReplayPosition,
): Bars {
  const { subRows, rows } = data;
  const { barIndex, subBarIndex } = replayPosition;

  if (barIndex === undefined) {
    return rows;
  }

  const fullBars = rows.slice(0, barIndex);
  if (subBarIndex === 0) {
    return fullBars;
  } else {
    const lastBar = aggregateRows(subRows[barIndex].slice(0, subBarIndex));
    return [...fullBars, lastBar];
  }
}

export function getTradeData(data: FullBarData): Bars {
  return applyFn(data.subRows, flatten<Bar>(), toArray());
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
    tradeDataBarIndex += data.subRows[i].length;
  }
  tradeDataBarIndex += subBarIndex;

  return tradeDataBarIndex;
}
