import { FormEntryBaseString } from './form-entry-base';
import { FormEntryCreatorAny } from './form-entry-creator';

export interface CreateFormBuilderInput<TEntry extends FormEntryBaseString> {
  readonly entryCreators: readonly FormEntryCreatorAny<TEntry>[];
}
