import React, { useCallback, useMemo } from 'react';
import { TwChartTimezone } from '../../../tw-chart/types';
import {
  CompletedTrade,
  TradeCloseReason,
  TradingParameters,
} from '../../types';
import { mdiPencil } from '@mdi/js';
import { IconButton } from '../../../shared/IconButton';
import { ValueDisplayItem } from '../../../shared/value-display/ValueDisplayItem';
import { ValueDisplayDataAnyList } from '../../../types';
import { mapGetOrThrow } from '@gmjs/data-container-util';

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

  const handleEdit = useCallback(() => {
    console.log('edit');
  }, []);

  return (
    <div className='flex flex-row items-center gap-2'>
      <div className='flex-1 grid grid-cols-12 items-center gap-2'>
        {displayItems.map((item, index) => {
          return <ValueDisplayItem key={index} item={item} />;
        })}
      </div>
      <IconButton icon={mdiPencil} onClick={handleEdit} />
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
      label: 'ID',
      value: id,
      precision: 0,
    },
    {
      kind: 'string',
      label: 'Dir',
      value: amount > 0 ? 'B' : 'S',
    },
    {
      kind: 'date',
      colSpan: 2,
      label: 'O Tm',
      fontSize: 10,
      value: openTime,
      timezone,
    },
    {
      kind: 'decimal',
      colSpan: 2,
      label: 'O Prc',
      value: openPrice,
      precision: priceDecimals,
    },
    {
      kind: 'date',
      colSpan: 2,
      label: 'C Tm',
      fontSize: 10,
      value: closeTime,
      timezone,
    },
    {
      kind: 'decimal',
      colSpan: 2,
      label: 'C Prc',
      value: closePrice,
      precision: priceDecimals,
    },
    {
      kind: 'decimal',
      label: 'Amt',
      value: amount,
      precision: 1,
    },
    {
      kind: 'string',
      label: 'Reas',
      value: mapGetOrThrow(CLOSE_REASON_DISPLAY_NAME_MAP, closeReason),
    },
  ];
}

const CLOSE_REASON_DISPLAY_NAME_MAP: ReadonlyMap<TradeCloseReason, string> =
  new Map([
    ['manual', 'Man'],
    ['stop-loss', 'SL'],
    ['limit', 'Lmt'],
  ]);
