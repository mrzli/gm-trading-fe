import React, { useMemo } from 'react';
import { mapGetOrThrow } from '@gmjs/data-container-util';
import { TwChartTimezone } from '../../../tw-chart/types';
import {
  CompletedTrade,
  TradeCloseReason,
  TradingParameters,
} from '../../types';
import { getCompletedTradePnl, getCompletedTradePnlPoints } from '../../util';
import {
  ValueDisplayDataAnyList,
  ValueDisplayItem,
} from '../../../components/shared';

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
  const displayItems = useMemo(
    () => getDisplayItems(timezone, tradingParams, item),
    [timezone, tradingParams, item],
  );

  return (
    <div className='grid grid-cols-10 items-center gap-2'>
      {displayItems.map((item, index) => {
        return <ValueDisplayItem key={index} item={item} />;
      })}
    </div>
  );
}

function getDisplayItems(
  timezone: TwChartTimezone,
  tradingParams: TradingParameters,
  item: CompletedTrade,
): ValueDisplayDataAnyList {
  const { priceDecimals } = tradingParams;

  const {
    id,
    openTime,
    openPrice,
    closeTime,
    closePrice,
    amount,
    closeReason,
  } = item;

  return [
    {
      kind: 'decimal',
      rowSpan: 2,
      label: 'ID',
      value: id,
      precision: 0,
    },
    {
      kind: 'date',
      colSpan: 2,
      label: 'Open Time',
      fontSize: 10,
      value: openTime,
      timezone,
    },
    {
      kind: 'decimal',
      colSpan: 2,
      label: 'Open Price',
      value: openPrice,
      precision: priceDecimals,
    },
    {
      kind: 'date',
      colSpan: 2,
      label: 'Close Time',
      fontSize: 10,
      value: closeTime,
      timezone,
    },
    {
      kind: 'decimal',
      colSpan: 2,
      label: 'Close Price',
      value: closePrice,
      precision: priceDecimals,
    },
    {
      kind: 'decimal',
      label: 'Amount',
      value: amount,
      precision: 1,
    },
    {
      kind: 'string',
      colSpan: 2,
      label: 'Direction',
      value: amount > 0 ? 'Buy' : 'Sell',
    },
    {
      kind: 'string',
      colSpan: 2,
      label: 'Close Reason',
      value: mapGetOrThrow(CLOSE_REASON_DISPLAY_NAME_MAP, closeReason),
    },
    {
      kind: 'decimal',
      colSpan: 2,
      label: 'P&L Pts',
      value: getCompletedTradePnlPoints(item),
      precision: 1,
    },
    {
      kind: 'decimal',
      colSpan: 2,
      label: 'P&L',
      value: getCompletedTradePnl(item),
      precision: priceDecimals,
    },
  ];
}

const CLOSE_REASON_DISPLAY_NAME_MAP: ReadonlyMap<TradeCloseReason, string> =
  new Map([
    ['manual', 'Manual'],
    ['stop-loss', 'Stop-Loss'],
    ['limit', 'Limit'],
  ]);
