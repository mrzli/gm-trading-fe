import { describe, expect, it } from '@jest/globals';
import { nomalizeXOffset, toFirstXIndex } from './x-adjustment';

describe('x-adjustment', () => {
  describe('toFirstXIndex()', () => {
    interface Example {
      readonly input: number;
      readonly expected: number;
    }

    const EXAMPLES: readonly Example[] = [
      {
        input: 0,
        expected: 0,
      },
      {
        input: 1,
        expected: 1,
      },
      {
        input: 1.1,
        expected: 1,
      },
      {
        input: -1,
        expected: 0,
      },
      {
        input: -1.1,
        expected: 0,
      },
    ];

    for (const example of EXAMPLES) {
      it(JSON.stringify(example), () => {
        const actual = toFirstXIndex(example.input);
        expect(actual).toEqual(example.expected);
      });
    }
  });

  describe('nomalizeXOffset()', () => {
    interface Example {
      readonly input: number;
      readonly expected: number;
    }

    const EXAMPLES: readonly Example[] = [
      {
        input: 0,
        expected: 0,
      },
      {
        input: 1,
        expected: 0,
      },
      {
        input: 1.1,
        expected: 0.1,
      },
      {
        input: -1,
        expected: -1,
      },
      {
        input: -1.1,
        expected: -1.1,
      },
    ];

    for (const example of EXAMPLES) {
      it(JSON.stringify(example), () => {
        const actual = nomalizeXOffset(example.input);
        expect(actual).toEqual(example.expected);
      });
    }
  });
});
