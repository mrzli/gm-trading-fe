import React from 'react';
import { applyFn } from '@gmjs/apply-function';
import { toMapBy } from '@gmjs/value-transformers';
import { mapGetOrThrow } from '@gmjs/data-container-util';
import {
  CreateFormBuilderInput,
  FormBuilder,
  FormDefinition,
  FormEntryBaseString,
} from './types';

const t = React.createElement;

export function createFormBuilder<TEntry extends FormEntryBaseString>(
  input: CreateFormBuilderInput<TEntry>,
): FormBuilder<TEntry> {
  const { entryCreators } = input;

  const entryCreatorsMap = applyFn(
    entryCreators,
    toMapBy((entryCreator) => entryCreator.kind),
  );

  return {
    build: (formDefinition: FormDefinition<TEntry>): React.ReactNode => {
      const { entries } = formDefinition;

      return t(
        'div',
        { className: undefined, styles: undefined },
        entries.map((entry) => {
          const { kind } = entry;
          const entryCreator = mapGetOrThrow(entryCreatorsMap, kind);
          return entryCreator.create(entry);
        }),
      );
    },
  };
}
