import React, { useCallback, useMemo } from 'react';
import cls from 'classnames';
import { invariant } from '@gmjs/assert';
import { arrayOfConstant } from '@gmjs/array-create';
import { mdiClose } from '@mdi/js';
import {
  ManualTradeActionAmendOrder,
  ManualTradeActionAmendTrade,
  ManualTradeActionAny,
  ManualTradeActionClose,
  ManualTradeActionOpen,
  TradingInputs,
} from '../../types';
import { IconButton } from '../../../shared/IconButton';
import { ValueDisplayDataAnyList } from '../../../types';
import { ValueDisplayItem } from '../../../shared/value-display/ValueDisplayItem';
import { TwChartTimezone } from '../../../tw-chart/types';

export interface ManualTradeActionItemProps {
  readonly timezone: TwChartTimezone;
  readonly tradingInputs: TradingInputs;
  readonly tradeAction: ManualTradeActionAny;
  readonly onRemoveClick: (id: number) => void;
}

export function ManualTradeActionItem({
  timezone,
  tradingInputs,
  tradeAction,
  onRemoveClick,
}: ManualTradeActionItemProps): React.ReactElement {
  const displayDataList = useMemo<ValueDisplayDataAnyList>(() => {
    return getValueDisplayDataList(timezone, tradingInputs, tradeAction);
  }, [timezone, tradingInputs, tradeAction]);

  const handleRemove = useCallback(() => {
    onRemoveClick(tradeAction.id);
  }, [onRemoveClick, tradeAction.id]);

  return (
    <div className='flex flex-row items-center gap-2'>
      <div className='flex-1 grid grid-cols-12 items-center gap-2'>
        {displayDataList.map((item, index) => {
          const span = item.span ?? 1;
          const itemClasses = cls({
            'col-span-1': span === 1,
            'col-span-2': span === 2,
            'col-span-3': span === 3,
            'col-span-4': span === 4,
          });
          return (
            <div key={index} className={itemClasses}>
              <ValueDisplayItem item={item} />
            </div>
          );
        })}
      </div>
      <IconButton icon={mdiClose} onClick={handleRemove} />
    </div>
  );
}

function getValueDisplayDataList(
  timezone: TwChartTimezone,
  tradingInputs: TradingInputs,
  tradeAction: ManualTradeActionAny,
): ValueDisplayDataAnyList {
  const { kind } = tradeAction;

  const priceDecimals = tradingInputs.params.priceDecimals;

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
      span: 3,
      label: 'Time',
      fontSize: 10,
      value: time,
      timezone,
    },
    { kind: 'none' },
    {
      kind: 'decimal',
      span: 2,
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
      span: 2,
      label: 'SL Dst',
      value: stopLossDistance,
      precision: priceDecimals,
    },
    {
      kind: 'decimal',
      span: 2,
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
      span: 3,
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
      span: 3,
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
      span: 2,
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
      span: 2,
      label: 'SL Dst',
      value: stopLossDistance,
      precision: priceDecimals,
    },
    {
      kind: 'decimal',
      span: 2,
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
      span: 3,
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
      span: 3,
    },
    {
      kind: 'decimal',
      span: 2,
      label: 'SL',
      value: stopLoss,
      precision: priceDecimals,
    },
    {
      kind: 'decimal',
      span: 2,
      label: 'L',
      value: limit,
      precision: priceDecimals,
    },
  ];
}
