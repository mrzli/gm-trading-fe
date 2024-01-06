import { z } from 'zod';
import validator from 'validator';
import { parseFloatOrThrow, parseIntegerOrThrow } from '@gmjs/number-util';

export const SCHEMA_EMPTY_STRING = z.literal('');

export const SCHEMA_INTEGER_STRING = z.string().regex(/^-?\d+$/);
export const SCHEMA_STRING_TO_INTEGER = SCHEMA_INTEGER_STRING.transform((v) =>
  parseIntegerOrThrow(v),
);

export type ZodStringToNumber = z.ZodEffects<z.ZodString, number, string>;

export function schemaStringAsIntegerInRange(
  min: number,
  max: number,
): z.ZodEffects<ZodStringToNumber, number, string> {
  return SCHEMA_STRING_TO_INTEGER.refine((v) => {
    return v >= min && v <= max;
  });
}

export function schemaStringIntegerInRange(
  min: number | undefined,
  max: number | undefined,
): z.ZodEffects<z.ZodString, string, string> {
  return z.string().refine((value) => {
    return validator.isInt(value, { min, max });
  });
}

export function schemaStringDecimalInRange(
  digits: number | undefined,
  min: number | undefined,
  max: number | undefined,
): z.ZodEffects<z.ZodString, string, string> {
  return z.string().refine((value) => {
    if (!validator.isDecimal(value, { decimal_digits: digits?.toString() })) {
      return false;
    }

    try {
      const num = parseFloatOrThrow(value);
      return (
        (min === undefined || num >= min) && (max === undefined || num <= max)
      );
    } catch {
      return false;
    }
  });
}
