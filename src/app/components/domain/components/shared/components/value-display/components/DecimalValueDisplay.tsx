import React, { CSSProperties } from 'react';
import { ValueDisplay } from '../../../../../../shared';
import { filterOutNullish } from '@gmjs/array-transformers';

export interface DecimalValueDisplayProps {
  readonly label?: string;
  readonly fontSize?: CSSProperties['fontSize'];
  readonly color?: CSSProperties['color'];
  readonly value: number | undefined;
  readonly precision: number;
  readonly prefix?: string;
  readonly suffix?: string;
}

export function DecimalValueDisplay({
  label,
  fontSize,
  color,
  value,
  precision,
  prefix,
  suffix,
}: DecimalValueDisplayProps): React.ReactElement {
  const valueString =
    value === undefined
      ? '-'
      : getValueString(value, precision, prefix, suffix);

  return (
    <ValueDisplay
      label={label}
      fontSize={fontSize}
      color={color}
      value={valueString}
    />
  );
}

function getValueString(
  value: number,
  precision: number,
  prefix: string | undefined,
  suffix: string | undefined,
): string {
  return filterOutNullish([prefix, value.toFixed(precision), suffix])
    .join(' ')
    .trim();
}
