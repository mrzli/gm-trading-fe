export const KINDS_OF_VALUE_DISPLAY_DATA = [
  'none',
  'string',
  'decimal',
  'date',
  'pnl',
] as const;

export type KindOfValueDisplayData =
  (typeof KINDS_OF_VALUE_DISPLAY_DATA)[number];

export interface ValueDisplayDataBase {
  readonly kind: KindOfValueDisplayData;
  readonly colIndex?: number;
  readonly colSpan?: number;
  readonly rowIndex?: number;
  readonly rowSpan?: number;
  readonly label?: string;
  readonly fontSize?: number;
}

export interface ValueDisplayDataNone extends ValueDisplayDataBase {
  readonly kind: 'none';
}

export interface ValueDisplayDataString extends ValueDisplayDataBase {
  readonly kind: 'string';
  readonly value: string;
  readonly onClick?: (value: string) => void;
}

export interface ValueDisplayDataDecimal extends ValueDisplayDataBase {
  readonly kind: 'decimal';
  readonly value: number | undefined;
  readonly precision: number;
  readonly prefix?: string;
  readonly suffix?: string;
  readonly onClick?: (value: number | undefined) => void;
}

export interface ValueDisplayDataDate extends ValueDisplayDataBase {
  readonly kind: 'date';
  readonly value: number;
  readonly timezone: string;
  readonly onClick?: (value: number) => void;
}

export interface ValueDisplayDataPnl extends ValueDisplayDataBase {
  readonly kind: 'pnl';
  readonly value: number | undefined;
  readonly precision: number;
  readonly onClick?: (value: number | undefined) => void;
}

export type ValueDisplayDataAny =
  | ValueDisplayDataNone
  | ValueDisplayDataString
  | ValueDisplayDataDecimal
  | ValueDisplayDataDate
  | ValueDisplayDataPnl;

export type ValueDisplayDataAnyList = readonly ValueDisplayDataAny[];
