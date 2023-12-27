import { TwChartResolution } from '../../tw-chart/types';
import {
  toTickerDataRows,
  groupDataRows,
  aggregateGroupedDataRows,
  aggregateRows,
} from './process-chart-data';
import { FullTickerData } from '../types';
import {
  BarReplayPosition,
  TickerDataRow,
  TickerDataRows,
} from '../../../types';
import { applyFn } from '@gmjs/apply-function';
import { compose } from '@gmjs/compose-function';
import { flatten, toArray } from '@gmjs/value-transformers';

export function rawDataToFullTickerData(
  rawData: readonly string[] | undefined,
  resolution: TwChartResolution,
): FullTickerData {
  const nonAggregatedRows = toTickerDataRows(rawData ?? []);
  const subRows = groupDataRows(nonAggregatedRows, resolution);
  const rows = aggregateGroupedDataRows(subRows);
  return {
    subRows,
    rows,
  };
}

export function getChartData(
  data: FullTickerData,
  replayPosition: BarReplayPosition,
): TickerDataRows {
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

export function getTradeData(data: FullTickerData): TickerDataRows {
  return applyFn(data.subRows, compose(flatten<TickerDataRow>(), toArray()));
}

export function getTradeDataBarIndex(
  data: FullTickerData,
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
