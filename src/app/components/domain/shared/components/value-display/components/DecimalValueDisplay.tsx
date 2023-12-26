import React, { CSSProperties } from 'react';
import { ValueDisplay } from '../../../../../shared';

export interface DecimalValueDisplayProps {
  readonly label?: string;
  readonly fontSize?: CSSProperties['fontSize'];
  readonly value: number | undefined;
  readonly precision: number;
}

export function DecimalValueDisplay({
  label,
  fontSize,
  value,
  precision,
}: DecimalValueDisplayProps): React.ReactElement {
  return (
    <ValueDisplay
      label={label}
      fontSize={fontSize}
      value={value?.toFixed(precision) ?? '-'}
    />
  );
}
