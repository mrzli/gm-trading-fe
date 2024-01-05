import { FormEntryBaseString } from './form-entry-base';

export interface FormEntryCreator<TEntry extends FormEntryBaseString> {
  readonly kind: TEntry['kind'];
  readonly create: (entryData: TEntry) => React.ReactNode;
}

export type FormEntryCreatorAny<TEntry extends FormEntryBaseString> =
  TEntry extends FormEntryBaseString ? FormEntryCreator<TEntry> : never;
