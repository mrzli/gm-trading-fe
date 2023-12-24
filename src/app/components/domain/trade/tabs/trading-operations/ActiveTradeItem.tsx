import React from 'react';
import { TwChartTimezone } from '../../../tw-chart/types';
import { ActiveTrade, TradingParameters } from '../../types';

export interface ActiveTradeItemProps {
  readonly timezone: TwChartTimezone;
  readonly tradingParams: TradingParameters;
  readonly item: ActiveTrade;
}

export function ActiveTradeItem({
  timezone,
  tradingParams,
  item,
}: ActiveTradeItemProps): React.ReactElement {
  return (<div>{'ActiveTradeItem'}</div>)
}
