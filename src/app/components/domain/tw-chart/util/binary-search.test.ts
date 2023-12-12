import { describe, expect, it } from '@jest/globals';
import { range } from '@gmjs/array-create';
import { binarySearch } from './binary-search';

describe('binary-search', () => {
  describe('binarySearch()', () => {
    const ARRAY: readonly number[] = range(0, 100, 10);
    const SELECTOR: (item: number) => number = (item) => item;

    describe('valid', () => {
      interface Example {
        readonly input: {
          readonly array: readonly number[];
          readonly value: number;
        };
        readonly expected: number;
      }

      const EXAMPLES: readonly Example[] = [
        {
          input: {
            array: ARRAY,
            value: -10,
          },
          expected: 0,
        },
        {
          input: {
            array: ARRAY,
            value: 110,
          },
          expected: 9,
        },
        {
          input: {
            array: ARRAY,
            value: 0,
          },
          expected: 0,
        },
        {
          input: {
            array: ARRAY,
            value: 10,
          },
          expected: 1,
        },
        {
          input: {
            array: ARRAY,
            value: 11,
          },
          expected: 1,
        },
        {
          input: {
            array: ARRAY,
            value: 19,
          },
          expected: 1,
        },
        {
          input: {
            array: ARRAY,
            value: 85,
          },
          expected: 8,
        },
        {
          input: {
            array: ARRAY,
            value: 90,
          },
          expected: 9,
        },
      ];

      for (const example of EXAMPLES) {
        it(JSON.stringify(example), () => {
          const actual = binarySearch(
            example.input.array,
            example.input.value,
            SELECTOR,
          );
          expect(actual).toEqual(example.expected);
        });
      }
    });

    describe('throws', () => {
      interface Example {
        readonly input: {
          readonly array: readonly number[];
          readonly value: number;
        };
      }

      const EXAMPLES: readonly Example[] = [
        {
          input: {
            array: [],
            value: 0,
          },
        },
      ];

      for (const example of EXAMPLES) {
        it(JSON.stringify(example), () => {
          const call = (): number =>
            binarySearch(example.input.array, example.input.value, SELECTOR);
          expect(call).toThrowError();
        });
      }
    });
  });
});
