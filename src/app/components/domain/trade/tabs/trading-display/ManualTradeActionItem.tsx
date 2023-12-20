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
import {
  DecimalValueDisplay,
  DecimalValueDisplayProps,
} from '../../../shared/DecimalValueDisplay';
import { arrayOfUndefined } from '@gmjs/array-create';
import { IconButton } from '../../../shared/IconButton';
import { mdiClose } from '@mdi/js';

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
  const displayProps = useMemo<DisplayProps>(() => {
    const items = getDisplayProps(tradingInputs, tradeAction);
    return [...items, ...arrayOfUndefined(NUM_COLUMNS - items.length)];
  }, [tradingInputs, tradeAction]);

  const handleRemove = useCallback(() => {
    onRemoveClick(tradeAction.id);
  }, [onRemoveClick, tradeAction.id]);

  return (
    <div className='flex flex-row items-center gap-2'>
      {displayProps.map((props, index) => {
        return (
          <div key={index} className='flex-1'>
            {props && <DecimalValueDisplay {...props} />}
          </div>
        );
      })}
      <IconButton icon={mdiClose} onClick={handleRemove} />
    </div>
  );
}

const NUM_COLUMNS = 6;

type DisplayProps = readonly (DecimalValueDisplayProps | undefined)[];

function getDisplayProps(
  tradingInputs: TradingInputs,
  tradeAction: ManualTradeActionAny,
): DisplayProps {
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
): DisplayProps {
  const { id, price, amount, stopLossDistance, limitDistance } = tradeAction;

  return [
    {
      label: 'ID',
      value: id,
      precision: 0,
    },
    {
      label: 'Price',
      value: price,
      precision: priceDecimals,
    },
    {
      label: 'Amount',
      value: amount,
      precision: 1,
    },
    {
      label: 'Stop Loss Distance',
      value: stopLossDistance,
      precision: priceDecimals,
    },
    {
      label: 'Limit Distance',
      value: limitDistance,
      precision: priceDecimals,
    },
  ];
}

function getDisplayPropsClose(
  tradeAction: ManualTradeActionClose,
  _priceDecimals: number,
): DisplayProps {
  const { id, targetId } = tradeAction;

  return [
    {
      label: 'ID',
      value: id,
      precision: 0,
    },
    {
      label: 'Target ID',
      value: targetId,
      precision: 0,
    },
  ];
}

function getDisplayPropsAmendOrder(
  tradeAction: ManualTradeActionAmendOrder,
  priceDecimals: number,
): DisplayProps {
  const { id, targetId, price, amount, stopLossDistance, limitDistance } =
    tradeAction;

  return [
    {
      label: 'ID',
      value: id,
      precision: 0,
    },
    {
      label: 'Target ID',
      value: targetId,
      precision: 0,
    },
    {
      label: 'Price',
      value: price,
      precision: priceDecimals,
    },
    {
      label: 'Amount',
      value: amount,
      precision: 1,
    },
    {
      label: 'Stop Loss Distance',
      value: stopLossDistance,
      precision: priceDecimals,
    },
    {
      label: 'Limit Distance',
      value: limitDistance,
      precision: priceDecimals,
    },
  ];
}

function getDisplayPropsAmendTrade(
  tradeAction: ManualTradeActionAmendTrade,
  priceDecimals: number,
): DisplayProps {
  const { id, targetId, stopLoss, limit } = tradeAction;

  return [
    {
      label: 'ID',
      value: id,
      precision: 0,
    },
    {
      label: 'Target ID',
      value: targetId,
      precision: 0,
    },
    {
      label: 'Stop Loss',
      value: stopLoss,
      precision: priceDecimals,
    },
    {
      label: 'Limit',
      value: limit,
      precision: priceDecimals,
    },
    undefined,
  ];
}
