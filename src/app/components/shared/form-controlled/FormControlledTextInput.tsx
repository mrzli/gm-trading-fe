/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';
import { TextInput } from '../input';

export interface FormControlledTextInputProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
  TContext,
> {
  readonly control: Control<TFieldValues, TContext>;
  readonly id: string;
  readonly name: TName;
  readonly label?: string;
}

export function FormControlledTextInput<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
  TContext = any,
>({
  control,
  id,
  name,
  label
}: FormControlledTextInputProps<
  TFieldValues,
  TName,
  TContext
>): React.ReactElement {
  return (
    <Controller<TFieldValues, TName>
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const { onChange, ...fieldRest } = field;
        const { error } = fieldState;

        return (
          <TextInput
            id={id}
            label={label}
            {...fieldRest}
            error={error !== undefined}
            onValueChange={onChange}
          />
        );
      }}
    />
  );
}
