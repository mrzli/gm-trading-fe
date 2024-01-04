import { parseIntegerOrThrow, parseFloatOrThrow } from '@gmjs/number-util';
import { UTCTimestamp } from 'lightweight-charts';
import { GroupedBars, Bar, Bars, ChartResolution } from '../../../types';
import { invariant } from '@gmjs/assert';
import { DAY_TO_SECONDS } from '../../../../../util';
import { resolutionToSeconds } from '../../../util';

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

export function groupDataBars(
  bars: Bars,
  resolution: ChartResolution,
): GroupedBars {
  switch (resolution) {
    case '1m':
    case '15m':
    case 'D': {
      return bars.map((item) => [item]);
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
        bars,
        resolutionToSeconds(resolution),
        // UNIX time starts at 1970-01-01 00:00:00 UTC, which is a Thursday
        // to get a time which starts at Monday, we need to offset by 3 days
        resolution === 'W' ? DAY_TO_SECONDS * 3 : 0,
      );
    }
    case 'M': {
      return groupDataByMonth(bars);
    }
  }
}

export function aggregateGroupedDataBars(bars: GroupedBars): Bars {
  return bars.map((item) => aggregateBars(item));
}

function groupDataByFixedInterval(
  bars: Bars,
  intervalSeconds: number,
  timeAdjustmentSeconds: number,
): GroupedBars {
  const groupedData: Bars[] = [];
  let bucket: Bar[] = [];

  for (const bar of bars) {
    const bucketIndex = getTimeBucketIndex(
      bar.time + timeAdjustmentSeconds,
      intervalSeconds,
    );
    if (
      bucket.length === 0 ||
      getTimeBucketIndex(
        bucket[0].time + timeAdjustmentSeconds,
        intervalSeconds,
      ) === bucketIndex
    ) {
      bucket.push(bar);
    } else {
      groupedData.push(bucket);
      bucket = [bar];
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

function groupDataByMonth(bars: Bars): GroupedBars {
  const groupedData: Bars[] = [];
  let bucket: Bar[] = [];

  for (const bar of bars) {
    const bucketIndex = getMonthTimeBucketIndex(bar.time);
    if (
      bucket.length === 0 ||
      getMonthTimeBucketIndex(bucket[0].time) === bucketIndex
    ) {
      bucket.push(bar);
    } else {
      groupedData.push(bucket);
      bucket = [bar];
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

export function aggregateBars(input: Iterable<Bar>): Bar {
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
