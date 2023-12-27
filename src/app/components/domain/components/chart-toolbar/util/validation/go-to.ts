import { z } from 'zod';
import validator from 'validator';
import { toSimpleSelectOption } from '../../../tw-chart/util';
import { SelectOption } from '../../../../../shared';
import { getDateInputParts } from '../util';
import { SCHEMA_EMPTY_STRING } from './base';
import { TYPES_OF_CHART_RESOLUTIONS, ChartResolution } from '../../../../types';

export const RESOLUTION_OPTIONS: readonly SelectOption<ChartResolution>[] =
  TYPES_OF_CHART_RESOLUTIONS.map((resolution) =>
    toSimpleSelectOption(resolution),
  );

export const SCHEMA_GO_TO_DATE = z.string().refine((value) => {
  const parts = getDateInputParts(value);

  if (parts.length === 1) {
    return validateDate(parts[0]);
  } else if (parts.length === 2) {
    return validateDate(parts[0]) && validateTime(parts[1]);
  } else {
    return false;
  }
});

export const SCHEMA_GO_TO_INPUT = z.union([
  SCHEMA_EMPTY_STRING,
  SCHEMA_GO_TO_DATE,
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
