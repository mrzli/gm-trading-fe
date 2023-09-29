/* eslint-disable unicorn/numeric-separators-style */
import { describe, expect, it } from '@jest/globals';
import {
  timestampToYear,
  timestampToMonth,
  timestampToDay,
  timestampToTime,
} from './format';

interface Example {
  readonly input: {
    readonly timestamp: number;
    readonly timezone: string;
  };
  readonly expected: string;
}

// 1672531200 - 2023-01-01 00:00:00Z

describe('format', () => {
  describe('timestampToYear()', () => {
    const EXAMPLES: readonly Example[] = [
      {
        input: { timestamp: 1672531200, timezone: 'UTC' },
        expected: '2023',
      },
      {
        input: { timestamp: 1672531200, timezone: 'Europe/Berlin' },
        expected: '2023',
      },
      {
        input: { timestamp: 1672531200, timezone: 'America/New_York' },
        expected: '2022',
      },
    ];

    for (const example of EXAMPLES) {
      it(JSON.stringify(example), () => {
        const actual = timestampToYear(
          example.input.timestamp,
          example.input.timezone,
        );
        expect(actual).toEqual(example.expected);
      });
    }
  });

  describe('timestampToMonth()', () => {
    const EXAMPLES: readonly Example[] = [
      {
        input: { timestamp: 1672531200, timezone: 'UTC' },
        expected: 'Jan',
      },
      {
        input: { timestamp: 1672531200, timezone: 'Europe/Berlin' },
        expected: 'Jan',
      },
      {
        input: { timestamp: 1672531200, timezone: 'America/New_York' },
        expected: 'Dec',
      },
    ];

    for (const example of EXAMPLES) {
      it(JSON.stringify(example), () => {
        const actual = timestampToMonth(
          example.input.timestamp,
          example.input.timezone,
        );
        expect(actual).toEqual(example.expected);
      });
    }
  });

  describe('timestampToDay()', () => {
    const EXAMPLES: readonly Example[] = [
      {
        input: { timestamp: 1672531200, timezone: 'UTC' },
        expected: '1',
      },
      {
        input: { timestamp: 1672531200, timezone: 'Europe/Berlin' },
        expected: '1',
      },
      {
        input: { timestamp: 1672531200, timezone: 'America/New_York' },
        expected: '31',
      },
    ];

    for (const example of EXAMPLES) {
      it(JSON.stringify(example), () => {
        const actual = timestampToDay(
          example.input.timestamp,
          example.input.timezone,
        );
        expect(actual).toEqual(example.expected);
      });
    }
  });

  describe('timestampToTime()', () => {
    const EXAMPLES: readonly Example[] = [
      {
        input: { timestamp: 1672531200, timezone: 'UTC' },
        expected: '00:00',
      },
      {
        input: { timestamp: 1672531200, timezone: 'Europe/Berlin' },
        expected: '01:00',
      },
      {
        input: { timestamp: 1672531200, timezone: 'America/New_York' },
        expected: '19:00',
      },
    ];

    for (const example of EXAMPLES) {
      it(JSON.stringify(example), () => {
        const actual = timestampToTime(
          example.input.timestamp,
          example.input.timezone,
        );
        expect(actual).toEqual(example.expected);
      });
    }
  });
});
