export interface FormEntryBase<TTypeOfEntryKind extends string> {
  readonly kind: TTypeOfEntryKind;
}

export type FormEntryBaseString = FormEntryBase<string>;
