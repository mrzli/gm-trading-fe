import React from 'react';
import { RightToolbarState } from './types';
import { invariant } from '@gmjs/assert';
import { TradeContainer } from '../trade/TradeContainer';
import { TickerDataRows } from '../../../types';

export interface TickerDataRightToolbarProps {
  readonly state: RightToolbarState;
  readonly barData: TickerDataRows;
  readonly barIndex: number;
}

export function TickerDataRightToolbar({
  state,
  barData,
  barIndex,
}: TickerDataRightToolbarProps): React.ReactElement {
  const content = getContent(state, barData, barIndex);

  return <div className='min-w-[480px] h-full'>{content}</div>;
}

function getContent(
  state: RightToolbarState,
  barData: TickerDataRows,
  barIndex: number,
): React.ReactElement {
  switch (state) {
    case 'trade': {
      return <TradeContainer barData={barData} barIndex={barIndex} />;
    }
    default: {
      invariant(false, `Invalid right toolbar state: ${state}`);
    }
  }
}
