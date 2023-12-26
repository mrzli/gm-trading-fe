import React, { CSSProperties, useMemo } from 'react';
import { ValueDisplay } from '../../../../../shared';
import { DateTime } from 'luxon';

export interface DateValueDisplayProps {
  readonly label?: string;
  readonly fontSize?: CSSProperties['fontSize'];
  readonly value: number;
  readonly timezone: string;
}

export function DateValueDisplay({
  label,
  fontSize,
  value,
  timezone,
}: DateValueDisplayProps): React.ReactElement {
  const formattedValue = useMemo(
    () => getFormattedValue(value, timezone),
    [value, timezone],
  );
  return (
    <ValueDisplay label={label} fontSize={fontSize} value={formattedValue} />
  );
}

function getFormattedValue(value: number, timezone: string): string {
  return DateTime.fromSeconds(value, {
    zone: timezone,
  }).toFormat('yyyy-MM-dd HH:mm:ss');
}
