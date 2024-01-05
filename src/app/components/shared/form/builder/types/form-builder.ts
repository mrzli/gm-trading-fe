import { FormDefinition } from './form-definition';
import { FormEntryBaseString } from './form-entry-base';

export interface FormBuilder<TEntry extends FormEntryBaseString> {
  readonly build: (formDefinition: FormDefinition<TEntry>) => React.ReactNode;
}
