import React from 'react';
import { TwChartTimezone } from '../../../tw-chart/types';
import { ActiveOrder, TradingParameters } from '../../types';

export interface ActiveOrderListProps {
  readonly timezone: TwChartTimezone;
  readonly tradingParams: TradingParameters;
  readonly items: readonly ActiveOrder[];
}

export function ActiveOrderList({
  timezone,
  tradingParams,
  items,
}: ActiveOrderListProps): React.ReactElement {
  return (
    <div className='flex flex-col gap-1'>
      <div>Active Orders</div>
      <div>List</div>
    </div>
  );
}
