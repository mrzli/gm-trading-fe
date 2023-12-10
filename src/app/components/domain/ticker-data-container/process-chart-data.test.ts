import { join } from 'node:path';
import { beforeAll, describe, expect, it } from '@jest/globals';
import { readTextAsync } from '@gmjs/fs-async';
import { mapGetOrThrow } from '@gmjs/data-container-util';
import {
  TYPES_OF_TW_CHART_RESOLUTION,
  TwChartResolution,
} from '../tw-chart/types';
import { TickerDataRow } from '../../../types';
import { toTickerDataRows } from './process-chart-data';

describe('process-chart-data', () => {
  let INPUT_MINUTE: readonly string[] = [];
  let INPUT_QUARTER: readonly string[] = [];
  let INPUT_DAY: readonly string[] = [];

  const RESULTS_MAP = new Map<TwChartResolution, readonly TickerDataRow[]>();

  beforeAll(async () => {
    INPUT_MINUTE = await readInputFile(
      join(__dirname, 'data/inputs/minute.csv'),
    );
    INPUT_QUARTER = await readInputFile(
      join(__dirname, 'data/inputs/quarter.csv'),
    );
    INPUT_DAY = await readInputFile(join(__dirname, 'data/inputs/day.csv'));

    for (const resolution of TYPES_OF_TW_CHART_RESOLUTION) {
      const path = join(__dirname, `data/results/${resolution}.json`);
      const result = await readResultsFile(path);
      RESULTS_MAP.set(resolution, result);
    }
  });

  function getInput(resolution: TwChartResolution): readonly string[] {
    switch (resolution) {
      case '1m':
      case '2m':
      case '5m':
      case '10m': {
        return INPUT_MINUTE;
      }
      case '15m':
      case '30m':
      case '1h':
      case '2h':
      case '4h': {
        return INPUT_QUARTER;
      }
      case 'D':
      case 'W':
      case 'M': {
        return INPUT_DAY;
      }
    }
  }

  describe('toTickerDataRows()', () => {
    type Example = TwChartResolution;

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
        const actual = toTickerDataRows(input, example);
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

async function readResultsFile(
  path: string,
): Promise<readonly TickerDataRow[]> {
  const content = await readTextAsync(path);
  return JSON.parse(content);
}
