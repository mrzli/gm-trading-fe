export const KINDS_OF_VALUE_DISPLAY_DATA = [
  'none',
  'string',
  'decimal',
  'date',
] as const;

export type KindOfValueDisplayData =
  (typeof KINDS_OF_VALUE_DISPLAY_DATA)[number];

export interface ValueDisplayDataBase {
  readonly kind: KindOfValueDisplayData;
  readonly span?: number;
  readonly label?: string;
  readonly fontSize?: number;
}

export interface ValueDisplayDataNone extends ValueDisplayDataBase {
  readonly kind: 'none';
}

export interface ValueDisplayDataString extends ValueDisplayDataBase {
  readonly kind: 'string';
  readonly value: string;
}

export interface ValueDisplayDataDecimal extends ValueDisplayDataBase {
  readonly kind: 'decimal';
  readonly value: number | undefined;
  readonly precision: number;
}

export interface ValueDisplayDataDate extends ValueDisplayDataBase {
  readonly kind: 'date';
  readonly value: number;
  readonly timezone: string;
}

export type ValueDisplayDataAny =
  | ValueDisplayDataNone
  | ValueDisplayDataString
  | ValueDisplayDataDecimal
  | ValueDisplayDataDate;

export type ValueDisplayDataAnyList = readonly ValueDisplayDataAny[];
