import { parseIntegerOrThrow, parseFloatOrThrow } from '@gmjs/number-util';
import { UTCTimestamp } from 'lightweight-charts';
import { GroupedBars, Bar, Bars, ChartResolution } from '../../../types';
import { invariant } from '@gmjs/assert';
import {
  DAY_TO_SECONDS,
  HOUR_TO_SECONDS,
  MINUTE_TO_SECONDS,
  WEEK_TO_SECONDS,
} from '../../../../../util';

export function toBars(lines: readonly string[]): Bars {
  return lines.map((element) => toBar(element));
}

function toBar(line: string): Bar {
  const [timestamp, _date, open, high, low, close] = line.split(',');

  return {
    time: parseIntegerOrThrow(timestamp) as UTCTimestamp,
    open: parseFloatOrThrow(open),
    high: parseFloatOrThrow(high),
    low: parseFloatOrThrow(low),
    close: parseFloatOrThrow(close),
  };
}

export function groupDataRows(
  rows: Bars,
  resolution: ChartResolution,
): GroupedBars {
  switch (resolution) {
    case '1m':
    case '15m':
    case 'D': {
      return rows.map((row) => [row]);
    }
    case '2m':
    case '5m':
    case '10m':
    case '30m':
    case '1h':
    case '2h':
    case '4h':
    case 'W': {
      return groupDataByFixedInterval(
        rows,
        resolutionToSeconds(resolution),
        // UNIX time starts at 1970-01-01 00:00:00 UTC, which is a Thursday
        // to get a time which starts at Monday, we need to offset by 3 days
        resolution === 'W' ? DAY_TO_SECONDS * 3 : 0,
      );
    }
    case 'M': {
      return groupDataByMonth(rows);
    }
  }
}

export function aggregateGroupedDataRows(rows: GroupedBars): Bars {
  return rows.map((row) => aggregateRows(row));
}

function groupDataByFixedInterval(
  rows: Bars,
  intervalSeconds: number,
  timeAdjustmentSeconds: number,
): GroupedBars {
  const groupedData: Bars[] = [];
  let bucket: Bar[] = [];

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
      groupedData.push(bucket);
      bucket = [row];
    }
  }

  if (bucket.length > 0) {
    groupedData.push(bucket);
    bucket = [];
  }

  return groupedData;
}

function getTimeBucketIndex(time: number, interval: number): number {
  return Math.floor(time / interval);
}

function resolutionToSeconds(resolution: ChartResolution): number {
  const unit = resolution.slice(-1);

  switch (unit) {
    case 'm': {
      const value = parseIntegerOrThrow(resolution.slice(0, -1));
      return value * MINUTE_TO_SECONDS;
    }
    case 'h': {
      const value = parseIntegerOrThrow(resolution.slice(0, -1));
      return value * HOUR_TO_SECONDS;
    }
    case 'D': {
      return DAY_TO_SECONDS;
    }
    case 'W': {
      return WEEK_TO_SECONDS;
    }
    default: {
      invariant(false, `Unexpected unit: ${unit}`);
    }
  }
}

function groupDataByMonth(rows: Bars): GroupedBars {
  const groupedData: Bars[] = [];
  let bucket: Bar[] = [];

  for (const row of rows) {
    const bucketIndex = getMonthTimeBucketIndex(row.time);
    if (
      bucket.length === 0 ||
      getMonthTimeBucketIndex(bucket[0].time) === bucketIndex
    ) {
      bucket.push(row);
    } else {
      groupedData.push(bucket);
      bucket = [row];
    }
  }

  if (bucket.length > 0) {
    groupedData.push(bucket);
    bucket = [];
  }

  return groupedData;
}

function getMonthTimeBucketIndex(time: number): number {
  const date = new Date(time * 1000);
  return date.getUTCFullYear() * 12 + date.getUTCMonth();
}

export function aggregateRows(input: Iterable<Bar>): Bar {
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
