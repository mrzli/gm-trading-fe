import React, { useCallback, useMemo } from 'react';
import { invariant } from '@gmjs/assert';
import { mdiClose } from '@mdi/js';
import {
  ManualTradeActionAmendOrder,
  ManualTradeActionAmendTrade,
  ManualTradeActionAny,
  ManualTradeActionClose,
  ManualTradeActionOpen,
  TradingParameters,
} from '../../types';
import { IconButton } from '../../../shared/IconButton';
import { ValueDisplayDataAnyList } from '../../../types';
import { ValueDisplayItem } from '../../../shared/value-display/ValueDisplayItem';
import { TwChartTimezone } from '../../../tw-chart/types';

export interface ManualTradeActionItemProps {
  readonly timezone: TwChartTimezone;
  readonly tradingParameters: TradingParameters;
  readonly tradeAction: ManualTradeActionAny;
  readonly onRemoveClick: (id: number) => void;
}

export function ManualTradeActionItem({
  timezone,
  tradingParameters,
  tradeAction,
  onRemoveClick,
}: ManualTradeActionItemProps): React.ReactElement {
  const displayDataList = useMemo<ValueDisplayDataAnyList>(() => {
    return getValueDisplayDataList(timezone, tradingParameters, tradeAction);
  }, [timezone, tradingParameters, tradeAction]);

  const handleRemove = useCallback(() => {
    onRemoveClick(tradeAction.id);
  }, [onRemoveClick, tradeAction.id]);

  return (
    <div className='flex flex-row items-center gap-2'>
      <div className='flex-1 grid grid-cols-11 items-center gap-2'>
        {displayDataList.map((item, index) => {
          return <ValueDisplayItem key={index} item={item} />;
        })}
      </div>
      <IconButton icon={mdiClose} onClick={handleRemove} />
    </div>
  );
}

function getValueDisplayDataList(
  timezone: TwChartTimezone,
  tradingParameters: TradingParameters,
  tradeAction: ManualTradeActionAny,
): ValueDisplayDataAnyList {
  const { kind } = tradeAction;

  const priceDecimals = tradingParameters.priceDecimals;

  switch (kind) {
    case 'open': {
      return getDisplayPropsOpen(tradeAction, timezone, priceDecimals);
    }
    case 'close': {
      return getDisplayPropsClose(tradeAction, timezone, priceDecimals);
    }
    case 'amend-order': {
      return getDisplayPropsAmendOrder(tradeAction, timezone, priceDecimals);
    }
    case 'amend-trade': {
      return getDisplayPropsAmendTrade(tradeAction, timezone, priceDecimals);
    }
    default: {
      invariant(false, `Invalid manual trade action kind: '${kind}'.`);
    }
  }
}

const DATE_DISPLAY_VALUE_SPAN = 2;

function getDisplayPropsOpen(
  tradeAction: ManualTradeActionOpen,
  timezone: TwChartTimezone,
  priceDecimals: number,
): ValueDisplayDataAnyList {
  const { id, time, price, amount, stopLossDistance, limitDistance } =
    tradeAction;

  return [
    {
      kind: 'decimal',
      label: 'ID',
      value: id,
      precision: 0,
    },
    {
      kind: 'date',
      colSpan: DATE_DISPLAY_VALUE_SPAN,
      label: 'Time',
      fontSize: 10,
      value: time,
      timezone,
    },
    { kind: 'none' },
    {
      kind: 'decimal',
      colSpan: 2,
      label: 'Price',
      value: price,
      precision: priceDecimals,
    },
    {
      kind: 'decimal',
      label: 'Amt',
      value: amount,
      precision: 1,
    },
    {
      kind: 'decimal',
      colSpan: 2,
      label: 'SL Dst',
      value: stopLossDistance,
      precision: priceDecimals,
    },
    {
      kind: 'decimal',
      colSpan: 2,
      label: 'L Dst',
      value: limitDistance,
      precision: priceDecimals,
    },
  ];
}

function getDisplayPropsClose(
  tradeAction: ManualTradeActionClose,
  timezone: TwChartTimezone,
  _priceDecimals: number,
): ValueDisplayDataAnyList {
  const { id, time, targetId } = tradeAction;

  return [
    {
      kind: 'decimal',
      label: 'ID',
      value: id,
      precision: 0,
    },
    {
      kind: 'date',
      colSpan: DATE_DISPLAY_VALUE_SPAN,
      label: 'Time',
      fontSize: 10,
      value: time,
      timezone,
    },
    {
      kind: 'decimal',
      label: 'Tgt ID',
      value: targetId,
      precision: 0,
    },
  ];
}

function getDisplayPropsAmendOrder(
  tradeAction: ManualTradeActionAmendOrder,
  timezone: TwChartTimezone,
  priceDecimals: number,
): ValueDisplayDataAnyList {
  const { id, time, targetId, price, amount, stopLossDistance, limitDistance } =
    tradeAction;

  return [
    {
      kind: 'decimal',
      label: 'ID',
      value: id,
      precision: 0,
    },
    {
      kind: 'date',
      colSpan: DATE_DISPLAY_VALUE_SPAN,
      label: 'Time',
      fontSize: 10,
      value: time,
      timezone,
    },
    {
      kind: 'decimal',
      label: 'Tgt ID',
      value: targetId,
      precision: 0,
    },
    {
      kind: 'decimal',
      colSpan: 2,
      label: 'Price',
      value: price,
      precision: priceDecimals,
    },
    {
      kind: 'decimal',
      label: 'Amt',
      value: amount,
      precision: 1,
    },
    {
      kind: 'decimal',
      colSpan: 2,
      label: 'SL Dst',
      value: stopLossDistance,
      precision: priceDecimals,
    },
    {
      kind: 'decimal',
      colSpan: 2,
      label: 'L Dst',
      value: limitDistance,
      precision: priceDecimals,
    },
  ];
}

function getDisplayPropsAmendTrade(
  tradeAction: ManualTradeActionAmendTrade,
  timezone: TwChartTimezone,
  priceDecimals: number,
): ValueDisplayDataAnyList {
  const { id, time, targetId, stopLoss, limit } = tradeAction;

  return [
    {
      kind: 'decimal',
      label: 'ID',
      value: id,
      precision: 0,
    },
    {
      kind: 'date',
      colSpan: DATE_DISPLAY_VALUE_SPAN,
      label: 'Time',
      fontSize: 10,
      value: time,
      timezone,
    },
    {
      kind: 'decimal',
      label: 'Tgt ID',
      value: targetId,
      precision: 0,
    },
    {
      kind: 'none',
      colSpan: 3,
    },
    {
      kind: 'decimal',
      colSpan: 2,
      label: 'SL',
      value: stopLoss,
      precision: priceDecimals,
    },
    {
      kind: 'decimal',
      colSpan: 2,
      label: 'L',
      value: limit,
      precision: priceDecimals,
    },
  ];
}
