import { z } from 'zod';
import { parseIntegerOrThrow } from '@gmjs/number-util';

export const SCHEMA_EMPTY_STRING = z.literal('');

export const SCHEMA_INTEGER_STRING = z.string().regex(/^-?\d+$/);
export const SCHEMA_STRING_TO_INTEGER = SCHEMA_INTEGER_STRING.transform((v) =>
  parseIntegerOrThrow(v),
);

export type ZodStringToNumber = z.ZodEffects<z.ZodString, number, string>;

export function createSchemaIntegerInRange(
  min: number,
  max: number,
): z.ZodEffects<ZodStringToNumber, number, string> {
  return SCHEMA_STRING_TO_INTEGER.refine((v) => {
    return v >= min && v <= max;
  });
}
