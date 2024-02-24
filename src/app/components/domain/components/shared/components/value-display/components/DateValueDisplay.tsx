import React, { CSSProperties, useCallback, useMemo } from 'react';
import { ValueDisplay } from '../../../../../../shared';
import { DateTime } from 'luxon';

export interface DateValueDisplayProps {
  readonly label?: string;
  readonly fontSize?: CSSProperties['fontSize'];
  readonly value: number;
  readonly timezone: string;
  readonly onClick?: (value: number) => void;
}

export function DateValueDisplay({
  label,
  fontSize,
  value,
  timezone,
  onClick,
}: DateValueDisplayProps): React.ReactElement {
  const formattedValue = useMemo(
    () => getFormattedValue(value, timezone),
    [value, timezone],
  );

  const handleClick = useCallback(() => {
    if (onClick) {
      onClick(value);
    }
  }, [onClick, value]);

  return (
    <ValueDisplay
      label={label}
      fontSize={fontSize}
      value={formattedValue}
      onClick={handleClick}
    />
  );
}

function getFormattedValue(value: number, timezone: string): string {
  return DateTime.fromSeconds(value, {
    zone: timezone,
  }).toFormat('yyyy-MM-dd HH:mm:ss');
}
