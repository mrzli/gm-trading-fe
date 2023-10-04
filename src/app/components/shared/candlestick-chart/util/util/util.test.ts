import { describe, expect, it } from '@jest/globals';
import { range } from '@gmjs/array-create';
import { findIndexBinaryExact } from './util';

describe('util', () => {
  describe('findIndexBinaryExact()', () => {
    const ARRAY: readonly number[] = range(0, 10);
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
            value: 0,
          },
          expected: 0,
        },
        {
          input: {
            array: ARRAY,
            value: 1,
          },
          expected: 1,
        },
        {
          input: {
            array: ARRAY,
            value: 9,
          },
          expected: 9,
        },
      ];

      for (const example of EXAMPLES) {
        it(JSON.stringify(example), () => {
          const actual = findIndexBinaryExact(
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
        {
          input: {
            array: ARRAY,
            value: -1,
          },
        },
        {
          input: {
            array: ARRAY,
            value: 1.5,
          },
        },
        {
          input: {
            array: ARRAY,
            value: 10,
          },
        },
      ];

      for (const example of EXAMPLES) {
        it(JSON.stringify(example), () => {
          const call = (): number =>
            findIndexBinaryExact(
              example.input.array,
              example.input.value,
              SELECTOR,
            );
          expect(call).toThrowError();
        });
      }
    });
  });
});
