import React from 'react';
import { TwChartTimezone } from '../../../tw-chart/types';
import { ActiveTrade, TradingParameters } from '../../types';

export interface ActiveTradeListProps {
  readonly timezone: TwChartTimezone;
  readonly tradingParams: TradingParameters;
  readonly items: readonly ActiveTrade[];
}

export function ActiveTradeList({
  timezone,
  tradingParams,
  items,
}: ActiveTradeListProps): React.ReactElement {
  return (
    <div className='flex flex-col gap-1'>
      <div>Active Trades</div>
      <div>List</div>
    </div>
  );
}
