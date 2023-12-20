import React from 'react';
import { ValueDisplayDataAny } from '../../types';
import { invariant } from '@gmjs/assert';
import { DecimalValueDisplay } from './DecimalValueDisplay';
import { ValueDisplay } from '../../../shared';
import { DateValueDisplay } from './DateValueDisplay';

export interface ValueDisplayItemProps {
  readonly item: ValueDisplayDataAny;
}

export function ValueDisplayItem({
  item,
}: ValueDisplayItemProps): React.ReactElement {
  const { kind, label } = item;

  switch (kind) {
    case 'none': {
      return <></>;
    }
    case 'string': {
      const { value } = item;
      return <ValueDisplay label={label} value={value} />;
    }
    case 'decimal': {
      const { value, precision } = item;
      return (
        <DecimalValueDisplay
          label={label}
          value={value}
          precision={precision}
        />
      );
    }
    case 'date': {
      const { value, timezone } = item;
      return (
        <DateValueDisplay label={label} value={value} timezone={timezone} />
      );
    }
    default: {
      invariant(false, `Unknown value display kind: '${kind}'.`);
    }
  }
}
