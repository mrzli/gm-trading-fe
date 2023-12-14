import { TwChartResolution } from '../../tw-chart/types';
import {
  toTickerDataRows,
  groupDataRows,
  aggregateGroupedDataRows,
} from './process-chart-data';
import { FullTickerData } from '../types';

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
