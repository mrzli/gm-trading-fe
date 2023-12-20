import React from 'react';
import { RightToolbarState } from './types';
import { invariant } from '@gmjs/assert';
import { TradeContainer } from '../trade/TradeContainer';
import { TradingChartData } from '../trade/types';

export interface TickerDataRightToolbarProps {
  readonly state: RightToolbarState;
  readonly chartData: TradingChartData;
}

export function TickerDataRightToolbar({
  state,
  chartData,
}: TickerDataRightToolbarProps): React.ReactElement {
  const content = getContent(state, chartData);

  return <div className='min-w-[480px] h-full'>{content}</div>;
}

function getContent(
  state: RightToolbarState,
  chartData: TradingChartData,
): React.ReactElement {
  switch (state) {
    case 'trade': {
      return <TradeContainer chartData={chartData} />;
    }
    default: {
      invariant(false, `Invalid right toolbar state: ${state}`);
    }
  }
}
