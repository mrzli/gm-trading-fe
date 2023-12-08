import { describe, expect, it } from '@jest/globals';
import { getXAxisTicks } from './x-axis';
import { AxisTickItem } from '../../types';
import { TickerDataResolution } from '@gmjs/gm-trading-shared';
import { TickerDataRow } from '../../../../../../app/types';
import { TEST_TICKER_ROWS_QUARTER } from '../../data';

describe('x-axis', () => {
  describe('getXAxisTicks()', () => {
    interface Example {
      readonly description: string;
      readonly input: {
        readonly resolution: TickerDataResolution;
        readonly normalizedData: readonly TickerDataRow[];
        readonly xNormalizedOffset: number;
        readonly slotWidth: number;
        readonly chartWidth: number;
      };
      readonly expected: readonly AxisTickItem[];
    }

    const EXAMPLES: readonly Example[] = [
      {
        description: 'xOffset 0',
        input: {
          resolution: 'quarter',
          normalizedData: TEST_TICKER_ROWS_QUARTER,
          xNormalizedOffset: 0,
          slotWidth: 50,
          chartWidth: 200,
        },
        expected: [
          {
            offset: 0,
            textLines: [],
          },
          {
            offset: 50,
            textLines: [],
          },
          {
            offset: 100,
            textLines: [],
          },
          {
            offset: 150,
            textLines: [],
          },
          {
            offset: 200,
            textLines: [],
          },
        ],
      },
      {
        description: 'xOffset -1',
        input: {
          resolution: 'quarter',
          normalizedData: TEST_TICKER_ROWS_QUARTER,
          xNormalizedOffset: -1,
          slotWidth: 50,
          chartWidth: 200,
        },
        expected: [
          {
            offset: 50,
            textLines: [],
          },
          {
            offset: 100,
            textLines: [],
          },
          {
            offset: 150,
            textLines: [],
          },
          {
            offset: 200,
            textLines: [],
          },
        ],
      },
      {
        description: 'xOffset -1.2',
        input: {
          resolution: 'quarter',
          normalizedData: TEST_TICKER_ROWS_QUARTER,
          xNormalizedOffset: -1.2,
          slotWidth: 50,
          chartWidth: 200,
        },
        expected: [
          {
            offset: 60,
            textLines: [],
          },
          {
            offset: 110,
            textLines: [],
          },
          {
            offset: 160,
            textLines: [],
          },
        ],
      },
      {
        description: 'xOffset 1',
        input: {
          resolution: 'quarter',
          normalizedData: TEST_TICKER_ROWS_QUARTER.slice(1),
          xNormalizedOffset: 0, // +1
          slotWidth: 50,
          chartWidth: 200,
        },
        expected: [
          {
            offset: 0,
            textLines: [],
          },
          {
            offset: 50,
            textLines: [],
          },
          {
            offset: 100,
            textLines: [],
          },
          {
            offset: 150,
            textLines: [],
          },
          {
            offset: 200,
            textLines: [],
          },
        ],
      },
      {
        description: 'xOffset 1.2',
        input: {
          resolution: 'quarter',
          normalizedData: TEST_TICKER_ROWS_QUARTER.slice(1),
          xNormalizedOffset: 0.2, // +1
          slotWidth: 50,
          chartWidth: 200,
        },
        expected: [
          {
            offset: 40,
            textLines: [],
          },
          {
            offset: 90,
            textLines: [],
          },
          {
            offset: 140,
            textLines: [],
          },
          {
            offset: 190,
            textLines: [],
          },
        ],
      },
    ];

    for (const example of EXAMPLES) {
      it(example.description, () => {
        const {
          resolution,
          normalizedData,
          xNormalizedOffset,
          slotWidth,
          chartWidth,
        } = example.input;
        const actual = getXAxisTicks(
          resolution,
          normalizedData,
          xNormalizedOffset,
          slotWidth,
          chartWidth,
        );
        expect(actual).toEqual(example.expected);
      });
    }
  });
});
