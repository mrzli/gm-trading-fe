import React from 'react';
import { TwChartTimezone } from '../../../tw-chart/types';
import { ActiveTrade, TradingParameters } from '../../types';
import { ActiveTradeItem } from './ActiveTradeItem';

export interface ActiveTradeListProps {
  readonly timezone: TwChartTimezone;
  readonly tradingParams: TradingParameters;
  readonly items: readonly ActiveTrade[];
  readonly onClose: (id: number) => void;
}

export function ActiveTradeList({
  timezone,
  tradingParams,
  items,
  onClose
}: ActiveTradeListProps): React.ReactElement {
  return (
    <div className='flex flex-col gap-1'>
      <div>Active Trades</div>
      <div className='flex flex-col gap-2'>
        {items.map((item, index) => {
          return (
            <ActiveTradeItem
              key={index}
              timezone={timezone}
              tradingParams={tradingParams}
              item={item}
              onClose={onClose}
            />
          );
        })}
      </div>
    </div>
  );
}
