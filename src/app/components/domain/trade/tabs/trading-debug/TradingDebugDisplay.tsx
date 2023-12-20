import React, { useMemo } from 'react';
import { TradingDataAndInputs } from '../../types';
import { PrettyDisplay } from '../../../../shared';

export interface TradingDebugDisplayProps {
  readonly value: TradingDataAndInputs;
}

export function TradingDebugDisplay({
  value,
}: TradingDebugDisplayProps): React.ReactElement {
  const content = useMemo<TradingDataAndInputs>(() => {
    return {
      ...value,
      barData: value.barData.slice(0, 2),
    };
  }, [value]);

  return <PrettyDisplay content={content} />;
}
