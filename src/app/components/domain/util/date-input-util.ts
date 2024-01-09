import { z } from 'zod';
import validator from 'validator';
import { applyFn } from '@gmjs/apply-function';
import { compose } from '@gmjs/compose-function';
import { filter, map, toArray } from '@gmjs/value-transformers';
import { SCHEMA_EMPTY_STRING } from './base-validations';
import { DateObjectTz } from '@gmjs/date-util';
import { ChartTimezone } from '../types';
import { parseIntegerOrThrow } from '@gmjs/number-util';

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

export function dateInputToDateObjectTz(
  value: string,
  timezone: ChartTimezone,
): DateObjectTz {
  const parts = getDateInputParts(value);
  const dateParts = parseDate(parts[0]);
  const timeParts = parts.length > 1 ? parseTime(parts[1]) : [0, 0];

  return {
    year: dateParts[0],
    month: dateParts[1],
    day: dateParts[2],
    hour: timeParts[0],
    minute: timeParts[1],
    second: 0,
    millisecond: 0,
    timezone,
  };
}

function getDateInputParts(value: string): readonly string[] {
  return applyFn(
    value.split(' '),
    compose(
      map((p) => p.trim()),
      filter((p) => p.length > 0),
      toArray(),
    ),
  );
}

function parseDate(value: string): readonly [number, number, number] {
  const parts = value.split('-');

  return [
    parseIntegerOrThrow(parts[0]),
    parseIntegerOrThrow(parts[1]),
    parseIntegerOrThrow(parts[2]),
  ];
}

function parseTime(value: string): readonly [number, number] {
  const parts = value.split(':');

  return [parseIntegerOrThrow(parts[0]), parseIntegerOrThrow(parts[1])];
}
