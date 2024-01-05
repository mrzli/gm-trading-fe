import { FormEntryBase, CreateFormBuilderInput, createFormBuilder } from "../builder";

export const KINDS_OF_FORM_ENTRIES = ['text-input', 'select'] as const;

export type FormEntryKind = (typeof KINDS_OF_FORM_ENTRIES)[number];

export interface FormEntryTextInput extends FormEntryBase<FormEntryKind> {
  readonly kind: 'text-input';
}

export interface FormEntrySelect extends FormEntryBase<FormEntryKind> {
  readonly kind: 'select';
}

export type FormEntryAny = FormEntryTextInput | FormEntrySelect;

const input: CreateFormBuilderInput<FormEntryAny> = {
  entryCreators: [
    {
      kind: 'text-input',
      create: (_entryData: FormEntryTextInput): React.ReactNode => {
        return <div>text-input</div>;
      },
    },
    {
      kind: 'select',
      create: (_entryData: FormEntrySelect): React.ReactNode => {
        return <div>select</div>;
      },
    },
  ],
};

export const FORM_BUILDER = createFormBuilder(input);