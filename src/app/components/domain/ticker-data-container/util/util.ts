import { invariant } from '@gmjs/assert';
import { Key } from 'ts-key-enum';
import { TwChartResolution } from '../../tw-chart/types';
import {
  toTickerDataRows,
  groupDataRows,
  aggregateGroupedDataRows,
} from './process-chart-data';
import { FullTickerData } from '../types';

export function rawDataToTickerData(
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

export function toLogicalOffset(
  event: React.KeyboardEvent<HTMLDivElement>,
): number {
  const base = toBaseLogicalOffset(event);
  const multiplier = toLogicalOffsetMultiplier(event);
  return base * multiplier;
}

function toBaseLogicalOffset(
  event: React.KeyboardEvent<HTMLDivElement>,
): number {
  switch (event.key) {
    case Key.ArrowLeft: {
      return -1;
    }
    case Key.ArrowRight: {
      return 1;
    }
  }

  invariant(false, `Unexpected key: ${event.key}`);
}

function toLogicalOffsetMultiplier(
  event: React.KeyboardEvent<HTMLDivElement>,
): number {
  return event.shiftKey ? 10 : 1;
}
