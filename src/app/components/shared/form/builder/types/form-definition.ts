import { FormEntryBaseString } from './form-entry-base';

export interface FormDefinition<TFormEntry extends FormEntryBaseString> {
  readonly entries: readonly TFormEntry[];
}
