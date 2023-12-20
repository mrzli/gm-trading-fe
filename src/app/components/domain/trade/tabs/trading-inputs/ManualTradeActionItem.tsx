import React, { useCallback, useMemo } from 'react';
import {
  ManualTradeActionAmendOrder,
  ManualTradeActionAmendTrade,
  ManualTradeActionAny,
  ManualTradeActionClose,
  ManualTradeActionOpen,
  TradingInputs,
} from '../../types';
import { invariant } from '@gmjs/assert';
import { arrayOfConstant } from '@gmjs/array-create';
import { IconButton } from '../../../shared/IconButton';
import { mdiClose } from '@mdi/js';
import { ValueDisplayDataAnyList } from '../../../types';
import { ValueDisplayItem } from '../../../shared/value-display/ValueDisplayItem';
import { VALUE_DISPLAY_DATA_NONE } from '../../../util';

export interface ManualTradeActionItemProps {
  readonly tradingInputs: TradingInputs;
  readonly tradeAction: ManualTradeActionAny;
  readonly onRemoveClick: (id: number) => void;
}

export function ManualTradeActionItem({
  tradingInputs,
  tradeAction,
  onRemoveClick,
}: ManualTradeActionItemProps): React.ReactElement {
  const displayDataList = useMemo<ValueDisplayDataAnyList>(() => {
    const items = getValueDisplayDataList(tradingInputs, tradeAction);
    return [
      ...items,
      ...arrayOfConstant(NUM_COLUMNS - items.length, VALUE_DISPLAY_DATA_NONE),
    ];
  }, [tradingInputs, tradeAction]);

  const handleRemove = useCallback(() => {
    onRemoveClick(tradeAction.id);
  }, [onRemoveClick, tradeAction.id]);

  return (
    <div className='flex flex-row items-center gap-2'>
      {displayDataList.map((item, index) => {
        return (
          <div key={index} className='flex-1'>
            {item && <ValueDisplayItem item={item} />}
          </div>
        );
      })}
      <IconButton icon={mdiClose} onClick={handleRemove} />
    </div>
  );
}

const NUM_COLUMNS = 6;

function getValueDisplayDataList(
  tradingInputs: TradingInputs,
  tradeAction: ManualTradeActionAny,
): ValueDisplayDataAnyList {
  const { kind } = tradeAction;

  const priceDecimals = tradingInputs.params.priceDecimals;

  switch (kind) {
    case 'open': {
      return getDisplayPropsOpen(tradeAction, priceDecimals);
    }
    case 'close': {
      return getDisplayPropsClose(tradeAction, priceDecimals);
    }
    case 'amend-order': {
      return getDisplayPropsAmendOrder(tradeAction, priceDecimals);
    }
    case 'amend-trade': {
      return getDisplayPropsAmendTrade(tradeAction, priceDecimals);
    }
    default: {
      invariant(false, `Invalid manual trade action kind: '${kind}'.`);
    }
  }
}

function getDisplayPropsOpen(
  tradeAction: ManualTradeActionOpen,
  priceDecimals: number,
): ValueDisplayDataAnyList {
  const { id, price, amount, stopLossDistance, limitDistance } = tradeAction;

  return [
    {
      kind: 'decimal',
      label: 'ID',
      value: id,
      precision: 0,
    },
    {
      kind: 'decimal',
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
      label: 'Stop Loss Distance',
      value: stopLossDistance,
      precision: priceDecimals,
    },
    {
      kind: 'decimal',
      label: 'Limit Distance',
      value: limitDistance,
      precision: priceDecimals,
    },
  ];
}

function getDisplayPropsClose(
  tradeAction: ManualTradeActionClose,
  _priceDecimals: number,
): ValueDisplayDataAnyList {
  const { id, targetId } = tradeAction;

  return [
    {
      kind: 'decimal',
      label: 'ID',
      value: id,
      precision: 0,
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
  priceDecimals: number,
): ValueDisplayDataAnyList {
  const { id, targetId, price, amount, stopLossDistance, limitDistance } =
    tradeAction;

  return [
    {
      kind: 'decimal',
      label: 'ID',
      value: id,
      precision: 0,
    },
    {
      kind: 'decimal',
      label: 'Target ID',
      value: targetId,
      precision: 0,
    },
    {
      kind: 'decimal',
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
      label: 'Stop Loss Distance',
      value: stopLossDistance,
      precision: priceDecimals,
    },
    {
      kind: 'decimal',
      label: 'Limit Distance',
      value: limitDistance,
      precision: priceDecimals,
    },
  ];
}

function getDisplayPropsAmendTrade(
  tradeAction: ManualTradeActionAmendTrade,
  priceDecimals: number,
): ValueDisplayDataAnyList {
  const { id, targetId, stopLoss, limit } = tradeAction;

  return [
    {
      kind: 'decimal',
      label: 'ID',
      value: id,
      precision: 0,
    },
    {
      kind: 'decimal',
      label: 'Target ID',
      value: targetId,
      precision: 0,
    },
    {
      kind: 'decimal',
      label: 'Stop Loss',
      value: stopLoss,
      precision: priceDecimals,
    },
    {
      kind: 'decimal',
      label: 'Limit',
      value: limit,
      precision: priceDecimals,
    },
  ];
}
