import React from 'react';
import { TwChartTimezone } from '../../../tw-chart/types';
import { CompletedTrade, TradingParameters } from '../../types';

export interface CompletedTradeListProps {
  readonly timezone: TwChartTimezone;
  readonly tradingParams: TradingParameters;
  readonly items: readonly CompletedTrade[];
}

export function CompletedTradeList({
  timezone,
  tradingParams,
  items,
}: CompletedTradeListProps): React.ReactElement {
  return (
    <div className='flex flex-col gap-1'>
      <div>Completed Trades</div>
      <div>List</div>
    </div>
  );
}
