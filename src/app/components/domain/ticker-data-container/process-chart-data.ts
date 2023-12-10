import { parseIntegerOrThrow, parseFloatOrThrow } from '@gmjs/number-util';
import { UTCTimestamp } from 'lightweight-charts';
import { TickerDataRow } from '../../../types';
import { TwChartResolution } from '../tw-chart/types';
import { invariant } from '@gmjs/assert';

export function toTickerDataRows(
  lines: readonly string[],
  resolution: TwChartResolution,
): readonly TickerDataRow[] {
  const rows = lines.map((element) => toTickerDataRow(element));

  return aggregateDataRows(rows, resolution);
}

// UNIX time starts at 1970-01-01 00:00:00 UTC, which is a Thursday
// to get a time which starts at Monday, we need to offset by 3 days
const WEEK_BUCKET_OFFET = 60 * 60 * 24 * 3;

function aggregateDataRows(
  rows: readonly TickerDataRow[],
  resolution: TwChartResolution,
): readonly TickerDataRow[] {
  switch (resolution) {
    case '1m':
    case '15m':
    case 'D': {
      return rows;
    }
    case '2m':
    case '5m':
    case '10m':
    case '30m':
    case '1h':
    case '2h':
    case '4h':
    case 'W': {
      return aggregateDataByFixedInterval(
        rows,
        resolutionToSeconds(resolution),
        resolution === 'W' ? WEEK_BUCKET_OFFET : 0,
      );
    }
    case 'M': {
      return aggregateDataByMonth(rows);
    }
  }
}

function toTickerDataRow(line: string): TickerDataRow {
  const [timestamp, _date, open, high, low, close] = line.split(',');

  return {
    time: parseIntegerOrThrow(timestamp) as UTCTimestamp,
    open: parseFloatOrThrow(open),
    high: parseFloatOrThrow(high),
    low: parseFloatOrThrow(low),
    close: parseFloatOrThrow(close),
  };
}

function aggregateDataByFixedInterval(
  rows: readonly TickerDataRow[],
  intervalSeconds: number,
  timeAdjustmentSeconds: number,
): readonly TickerDataRow[] {
  const aggregatedData: TickerDataRow[] = [];
  let bucket: TickerDataRow[] = [];

  for (const row of rows) {
    const bucketIndex = getTimeBucketIndex(
      row.time + timeAdjustmentSeconds,
      intervalSeconds,
    );
    if (
      bucket.length === 0 ||
      getTimeBucketIndex(
        bucket[0].time + timeAdjustmentSeconds,
        intervalSeconds,
      ) === bucketIndex
    ) {
      bucket.push(row);
    } else {
      aggregatedData.push(aggregateInterval(bucket));
      bucket = [row];
    }
  }

  if (bucket.length > 0) {
    aggregatedData.push(aggregateInterval(bucket));
    bucket = [];
  }

  return aggregatedData;
}

function getTimeBucketIndex(time: number, interval: number): number {
  return Math.floor(time / interval);
}

function resolutionToSeconds(resolution: TwChartResolution): number {
  const unit = resolution.slice(-1);

  switch (unit) {
    case 'm': {
      const value = parseIntegerOrThrow(resolution.slice(0, -1));
      return value * 60;
    }
    case 'h': {
      const value = parseIntegerOrThrow(resolution.slice(0, -1));
      return value * 60 * 60;
    }
    case 'D': {
      return 24 * 60 * 60;
    }
    case 'W': {
      return 7 * 24 * 60 * 60;
    }
    default: {
      invariant(false, `Unexpected unit: ${unit}`);
    }
  }
}

function aggregateDataByMonth(
  rows: readonly TickerDataRow[],
): readonly TickerDataRow[] {
  const aggregatedData: TickerDataRow[] = [];
  let bucket: TickerDataRow[] = [];

  for (const row of rows) {
    const bucketIndex = getMonthTimeBucketIndex(row.time);
    if (
      bucket.length === 0 ||
      getMonthTimeBucketIndex(bucket[0].time) === bucketIndex
    ) {
      bucket.push(row);
    } else {
      aggregatedData.push(aggregateInterval(bucket));
      bucket = [row];
    }
  }

  if (bucket.length > 0) {
    aggregatedData.push(aggregateInterval(bucket));
    bucket = [];
  }

  return aggregatedData;
}

function getMonthTimeBucketIndex(time: number): number {
  const date = new Date(time * 1000);
  return date.getUTCFullYear() * 12 + date.getUTCMonth();
}

function aggregateInterval(input: Iterable<TickerDataRow>): TickerDataRow {
  let time: UTCTimestamp | undefined;
  let open: number | undefined;
  let high: number | undefined;
  let low: number | undefined;
  let close: number | undefined;

  for (const item of input) {
    if (time === undefined) {
      time = item.time;
    }
    if (open === undefined) {
      open = item.open;
    }
    if (high === undefined || item.high > high) {
      high = item.high;
    }
    if (low === undefined || item.low < low) {
      low = item.low;
    }
    close = item.close;
  }

  if (
    time === undefined ||
    open === undefined ||
    high === undefined ||
    low === undefined ||
    close === undefined
  ) {
    invariant(false, 'No items in aggregate interval.');
  }

  return { time, open, high, low, close };
}
