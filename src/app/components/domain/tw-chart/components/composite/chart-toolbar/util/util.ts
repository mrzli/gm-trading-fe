import { applyFn } from '@gmjs/apply-function';
import { compose } from '@gmjs/compose-function';
import { filter, map, toArray } from '@gmjs/value-transformers';

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
