import React from 'react';
import { TwChartTimezone } from '../../../tw-chart/types';
import { CompletedTrade, TradingParameters } from '../../types';

export interface CompletedTradeItemProps {
  readonly timezone: TwChartTimezone;
  readonly tradingParams: TradingParameters;
  readonly item: CompletedTrade;
}

export function CompletedTradeItem({
  timezone,
  tradingParams,
  item,
}: CompletedTradeItemProps): React.ReactElement {
  return <div>{'CompletedTradeItem'}</div>;
}
