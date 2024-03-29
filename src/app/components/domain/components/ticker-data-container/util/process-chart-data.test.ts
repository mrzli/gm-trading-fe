import { join } from 'node:path';
import { beforeAll, describe, expect, it } from '@jest/globals';
import { readTextAsync } from '@gmjs/fs-async';
import { mapGetOrThrow } from '@gmjs/data-container-util';
import { Bars } from '../../../types';
import {
  toBars,
  groupDataBars,
  aggregateGroupedDataBars,
} from './process-chart-data';
import {
  TYPES_OF_TICKER_DATA_RESOLUTIONS,
  TickerDataResolution,
} from '@gmjs/gm-trading-shared';

describe('process-chart-data', () => {
  let INPUT_MINUTE: readonly string[] = [];
  let INPUT_QUARTER: readonly string[] = [];
  let INPUT_DAY: readonly string[] = [];

  let INPUT_MINUTE_BARS: Bars = [];
  let INPUT_QUARTER_BARS: Bars = [];
  let INPUT_DAY_BARS: Bars = [];

  const RESULTS_MAP = new Map<TickerDataResolution, Bars>();

  beforeAll(async () => {
    INPUT_MINUTE = await readInputFile(
      join(__dirname, 'data/inputs/minute.csv'),
    );
    INPUT_MINUTE_BARS = toBars(INPUT_MINUTE);
    INPUT_QUARTER = await readInputFile(
      join(__dirname, 'data/inputs/quarter.csv'),
    );
    INPUT_QUARTER_BARS = toBars(INPUT_QUARTER);
    INPUT_DAY = await readInputFile(join(__dirname, 'data/inputs/day.csv'));
    INPUT_DAY_BARS = toBars(INPUT_DAY);

    for (const resolution of TYPES_OF_TICKER_DATA_RESOLUTIONS) {
      const path = join(__dirname, `data/results/${resolution}.json`);
      const result = await readResultsFile(path);
      RESULTS_MAP.set(resolution, result);
    }
  });

  function getInput(resolution: TickerDataResolution): Bars {
    switch (resolution) {
      case '1m':
      case '2m':
      case '5m':
      case '10m': {
        return INPUT_MINUTE_BARS;
      }
      case '15m':
      case '30m':
      case '1h':
      case '2h':
      case '4h': {
        return INPUT_QUARTER_BARS;
      }
      case 'D':
      case 'W':
      case 'M': {
        return INPUT_DAY_BARS;
      }
    }
  }

  describe('aggregateDataBars', () => {
    type Example = TickerDataResolution;

    const EXAMPLES: readonly Example[] = [
      '1m',
      '2m',
      '5m',
      '10m',
      '15m',
      '30m',
      '1h',
      '2h',
      '4h',
      'D',
      'W',
      'M',
    ];

    for (const example of EXAMPLES) {
      it(JSON.stringify(example), () => {
        const input = getInput(example);
        const expected = mapGetOrThrow(RESULTS_MAP, example);
        const actual = aggregateGroupedDataBars(groupDataBars(input, example));
        // console.log('actual', actual);
        // console.log('expected', expected);
        expect(actual).toEqual(expected);
      });
    }
  });
});

async function readInputFile(path: string): Promise<readonly string[]> {
  const content = await readTextAsync(path);
  const lines = content.split('\n').filter((line) => line.trim().length > 0);
  return lines.length > 0 ? lines.slice(1) : [];
}

async function readResultsFile(path: string): Promise<Bars> {
  const content = await readTextAsync(path);
  return JSON.parse(content);
}
