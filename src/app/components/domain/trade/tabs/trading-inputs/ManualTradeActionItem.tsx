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
import { VALUE_DISPLAY_DATA_NONE } from '../../../util';
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
    const items = getValueDisplayDataList(timezone, tradingInputs, tradeAction);
    const totalSpan = items.reduce((sum, item) => sum + (item.span ?? 1), 0);
    return [
      ...items,
      ...arrayOfConstant(NUM_COLUMNS - totalSpan, VALUE_DISPLAY_DATA_NONE),
    ];
  }, [timezone, tradingInputs, tradeAction]);

  const handleRemove = useCallback(() => {
    onRemoveClick(tradeAction.id);
  }, [onRemoveClick, tradeAction.id]);

  return (
    <div className='flex flex-row items-center gap-2'>
      {displayDataList.map((item, index) => {
        const span = item.span ?? 1;
        const itemClasses = cls({
          'flex-1': span === 1,
          'flex-[2_2_0%]': span === 2,
          'flex-[3_3_0%]': span === 3,
          'flex-[4_4_0%]': span === 4,
        });
        return (
          <div key={index} className={itemClasses}>
            <ValueDisplayItem item={item} />
          </div>
        );
      })}
      <IconButton icon={mdiClose} onClick={handleRemove} />
    </div>
  );
}

const NUM_COLUMNS = 10;

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
    {
      kind: 'decimal',
      span: 2,
      label: 'Price',
      value: price,
      precision: priceDecimals,
    },
    {
      kind: 'decimal',
      label: 'Amount',
      value: amount,
      precision: 1,
    },
    {
      kind: 'decimal',
      label: 'SL Dist',
      value: stopLossDistance,
      precision: priceDecimals,
    },
    {
      kind: 'decimal',
      label: 'Lmt Dist',
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
      label: 'Target ID',
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
      label: 'Target ID',
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
      label: 'Amount',
      value: amount,
      precision: 1,
    },
    {
      kind: 'decimal',
      label: 'SL Dist',
      value: stopLossDistance,
      precision: priceDecimals,
    },
    {
      kind: 'decimal',
      label: 'Lmt Dist',
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
      label: 'Target ID',
      value: targetId,
      precision: 0,
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
      label: 'Limit',
      value: limit,
      precision: priceDecimals,
    },
  ];
}
