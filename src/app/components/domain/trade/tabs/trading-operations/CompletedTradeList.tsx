import React from 'react';
import { TwChartTimezone } from '../../../tw-chart/types';
import { CompletedTrade, TradingParameters } from '../../types';
import { CompletedTradeItem } from './CompletedTradeItem';

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
      <div className='flex flex-col gap-2'>
        {items.map((item, index) => {
          return (
            <CompletedTradeItem
              key={index}
              timezone={timezone}
              tradingParams={tradingParams}
              item={item}
            />
          );
        })}
      </div>
    </div>
  );
}
