export interface SelectOption<TValue extends string> {
  readonly label: string;
  readonly value: TValue;
}

export type TwSelectValue<
  TValue extends string,
  TAllowUndefined extends boolean,
> = TAllowUndefined extends true ? TValue | undefined : TValue;

export type TwSelectionRenderer<TValue extends string> = (
  option?: SelectOption<TValue>,
) => React.ReactNode;

export type TwSelectItemRenderer<TValue extends string> = (
  option: SelectOption<TValue>,
) => React.ReactNode;
