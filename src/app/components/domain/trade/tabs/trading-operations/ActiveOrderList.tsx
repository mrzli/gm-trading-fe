import React from 'react';
import { TwChartTimezone } from '../../../tw-chart/types';
import { ActiveOrder } from '../../types';

export interface ActiveOrderListProps {
  readonly timezone: TwChartTimezone;
  readonly items: readonly ActiveOrder[];
}

export function ActiveOrderList({
  timezone,
  items,
}: ActiveOrderListProps): React.ReactElement {
  return (
    <div className='flex flex-col gap-1'>
      <div>Active Orders</div>
      <div>List</div>
    </div>
  );
}
