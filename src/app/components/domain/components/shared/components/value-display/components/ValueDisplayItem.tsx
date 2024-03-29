import React, { useMemo } from 'react';
import { ValueDisplayDataAny } from '../types';
import { invariant } from '@gmjs/assert';
import { DecimalValueDisplay } from './DecimalValueDisplay';
import { ValueDisplay } from '../../../../../../shared';
import { DateValueDisplay } from './DateValueDisplay';
import { getPnlColor } from '../util';

export interface ValueDisplayItemProps {
  readonly item: ValueDisplayDataAny;
}

export function ValueDisplayItem({
  item,
}: ValueDisplayItemProps): React.ReactElement {
  const { colIndex, colSpan, rowIndex, rowSpan } = item;

  const styles = useMemo(
    () => ({
      gridColumnStart: colIndex,
      gridColumnEnd: colSpan ? `span ${colSpan}` : undefined,
      gridRowStart: rowIndex,
      gridRowEnd: rowSpan ? `span ${rowSpan}` : undefined,
    }),
    [colIndex, colSpan, rowIndex, rowSpan],
  );
  const content = getValueDisplayItemContent(item);

  return <div style={styles}>{content}</div>;
}

function getValueDisplayItemContent(
  item: ValueDisplayDataAny,
): React.ReactElement {
  const { kind, label, fontSize } = item;

  switch (kind) {
    case 'none': {
      return <>&nbsp;</>;
    }
    case 'string': {
      const { value, onClick } = item;
      return (
        <ValueDisplay
          label={label}
          fontSize={fontSize}
          value={value}
          onClick={onClick}
        />
      );
    }
    case 'decimal': {
      const { value, precision, onClick } = item;
      return (
        <DecimalValueDisplay
          label={label}
          fontSize={fontSize}
          value={value}
          precision={precision}
          onClick={onClick}
        />
      );
    }
    case 'date': {
      const { value, timezone, onClick } = item;
      return (
        <DateValueDisplay
          label={label}
          fontSize={fontSize}
          value={value}
          timezone={timezone}
          onClick={onClick}
        />
      );
    }
    case 'pnl': {
      const { value, precision, onClick } = item;
      return (
        <DecimalValueDisplay
          label={label}
          fontSize={fontSize}
          color={getPnlColor(value)}
          value={value}
          precision={precision}
          onClick={onClick}
        />
      );
    }
    default: {
      invariant(false, `Unknown value display kind: '${kind}'.`);
    }
  }
}
