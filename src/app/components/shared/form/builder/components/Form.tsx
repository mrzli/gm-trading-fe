import React, { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

export type FormFieldValuePrimitive = string | number | boolean;
export type FormFieldValue =
  | FormFieldValuePrimitive
  | readonly FormFieldValuePrimitive[]
  | { readonly [key: string]: FormFieldValuePrimitive };

export interface FormValues {
  readonly [key: string]: FormFieldValue;
}

export interface FormApi {
  readonly triggerSubmit: () => void;
}

export interface RenderFormInput {
  readonly triggerSubmit: () => void;
}

export interface FormProps<TFormValues extends FormValues> {
  readonly onFormApiChange?: (api: FormApi) => void;
  readonly value: TFormValues;
  readonly onValueChange: (value: TFormValues) => void;
  readonly render: (input: RenderFormInput) => React.ReactNode;
}

export function Form<TFormValues extends FormValues>({
  onFormApiChange,
  value,
  onValueChange,
  render,
}: FormProps<TFormValues>): React.ReactElement {
  const { handleSubmit, control, formState } = useForm<TFormValues>({
    values: value,
  });

  const submitHandler = useCallback(
    (inputs: TFormValues) => {
      onValueChange(inputs);
    },
    [onValueChange],
  );

  const triggerSubmit = useMemo(
    () => handleSubmit(submitHandler),
    [handleSubmit, submitHandler],
  );

  useEffect(() => {
    if (!onFormApiChange) {
      return;
    }

    const formApi: FormApi = {
      triggerSubmit,
    };
    onFormApiChange(formApi);
  }, [onFormApiChange, triggerSubmit]);

  const renderFormInput = useMemo<RenderFormInput>(
    () => ({
      triggerSubmit,
    }),
    [triggerSubmit],
  );

  return <form onSubmit={triggerSubmit}>{render(renderFormInput)}</form>;
}
