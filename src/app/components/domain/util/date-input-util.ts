import { z } from 'zod';
import validator from 'validator';
import { applyFn } from '@gmjs/apply-function';
import { compose } from '@gmjs/compose-function';
import { filter, map, toArray } from '@gmjs/value-transformers';
import { SCHEMA_EMPTY_STRING } from './base-validations';

export const SCHEMA_DATE_FOR_INPUT = z.string().refine((value) => {
  const parts = getDateInputParts(value);

  if (parts.length === 1) {
    return validateDate(parts[0]);
  } else if (parts.length === 2) {
    return validateDate(parts[0]) && validateTime(parts[1]);
  } else {
    return false;
  }
});

export const SCHEMA_DATE_INPUT = z.union([
  SCHEMA_EMPTY_STRING,
  SCHEMA_DATE_FOR_INPUT,
]);

function validateDate(value: string): boolean {
  return validator.isDate(value, {
    format: 'YYYY-MM-DD',
    strictMode: true,
    delimiters: ['-'],
  });
}

function validateTime(value: string): boolean {
  return validator.isTime(value);
}

export function dateInputToIso(value: string): string {
  return getDateInputParts(value).join('T');
}

export function getDateInputParts(value: string): readonly string[] {
  return applyFn(
    value.split(' '),
    compose(
      map((p) => p.trim()),
      filter((p) => p.length > 0),
      toArray(),
    ),
  );
}
