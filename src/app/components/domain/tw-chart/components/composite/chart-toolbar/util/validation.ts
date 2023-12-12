import { z } from 'zod';
import validator from 'validator';
import {
  TYPES_OF_TW_CHART_RESOLUTION,
  TwChartResolution,
} from '../../../../types';
import { toSimpleTwSelectOption } from '../../../../util';
import { TwSelectOption } from '../../../form/select-button/types';
import { getDateInputParts } from './util';

export const RESOLUTION_OPTIONS: readonly TwSelectOption<TwChartResolution>[] =
  TYPES_OF_TW_CHART_RESOLUTION.map((resolution) =>
    toSimpleTwSelectOption(resolution),
  );

export const SCHEME_DATE = z.string().refine((value) => {
  const parts = getDateInputParts(value);

  if (parts.length === 1) {
    return validateDate(parts[0]);
  } else if (parts.length === 2) {
    return validateDate(parts[0]) && validateTime(parts[1]);
  } else {
    return false;
  }
});

export const SCHEME_GO_TO_INPUT = z.union([z.literal(''), SCHEME_DATE]);

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