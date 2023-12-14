import { TwBarReplaySettings, TwChartResolution } from '../../tw-chart/types';
import {
  toTickerDataRows,
  groupDataRows,
  aggregateGroupedDataRows,
  aggregateRows,
} from './process-chart-data';
import { FullTickerData } from '../types';
import { TickerDataRows } from '../../../../types';

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
  replaySettings: TwBarReplaySettings,
): TickerDataRows {
  const { subRows, rows } = data;
  const { barIndex, subBarIndex } = replaySettings;

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
