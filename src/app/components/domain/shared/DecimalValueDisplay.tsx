import React from 'react';
import { ValueDisplay } from '../../shared';

export interface DecimalValueDisplayProps {
  readonly label?: string;
  readonly value: number | undefined;
  readonly precision: number;
}

export function DecimalValueDisplay({
  label,
  value,
  precision,
}: DecimalValueDisplayProps): React.ReactElement {
  return (
    <ValueDisplay label={label} value={value?.toFixed(precision) ?? '-'} />
  );
}
