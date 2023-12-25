import React from 'react';
import { TwChartTimezone } from '../../../tw-chart/types';
import { ActiveOrder, TradingParameters } from '../../types';
import { ActiveOrderItem } from './ActiveOrderItem';

export interface ActiveOrderListProps {
  readonly timezone: TwChartTimezone;
  readonly tradingParams: TradingParameters;
  readonly items: readonly ActiveOrder[];
  readonly onCancel: (id: number) => void;
}

export function ActiveOrderList({
  timezone,
  tradingParams,
  items,
  onCancel,
}: ActiveOrderListProps): React.ReactElement {
  return (
    <div className='flex flex-col gap-1'>
      <div>Active Orders</div>
      <div className='flex flex-col gap-2'>
        {items.map((item, index) => {
          return (
            <ActiveOrderItem
              key={index}
              timezone={timezone}
              tradingParams={tradingParams}
              item={item}
              onCancel={onCancel}
            />
          );
        })}
      </div>
    </div>
  );
}
