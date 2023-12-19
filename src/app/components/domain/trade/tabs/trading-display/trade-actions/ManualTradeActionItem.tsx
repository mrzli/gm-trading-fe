import React from 'react';
import { TradeActionManual } from '../../../types';
import { invariant } from '@gmjs/assert';
import { ManualTradeActionItemCreateOrder } from './specific/ManualTradeActionItemCreateOrder';
import { ManualTradeActionItemCancelOrder } from './specific/ManualTradeActionItemCancelOrder';
import { ManualTradeActionItemCloseTrade } from './specific/ManualTradeActionItemCloseTrade';
import { ManualTradeActionItemAdjustOrder } from './specific/ManualTradeActionItemAdjustOrder';
import { ManualTradeActionItemAdjustTrade } from './specific/ManualTradeActionItemAdjustTrade';

export interface ManualTradeActionItemProps {
  readonly tradeAction: TradeActionManual;
  readonly allTradeActions: ReadonlyMap<number, TradeActionManual>;
}

export function ManualTradeActionItem({
  tradeAction,
  allTradeActions,
}: ManualTradeActionItemProps): React.ReactElement {
  return getTradeActionElement(tradeAction, allTradeActions);
}

function getTradeActionElement(
  tradeAction: TradeActionManual,
  allTradeActions: ReadonlyMap<number, TradeActionManual>
): React.ReactElement {
  const { kind } = tradeAction;

  switch (kind) {
    case 'create-order': {
      return <ManualTradeActionItemCreateOrder tradeAction={tradeAction} />;
    }
    case 'cancel-order': {
      
      return <ManualTradeActionItemCancelOrder tradeAction={tradeAction} />;
    }
    case 'close-trade': {
      return <ManualTradeActionItemCloseTrade tradeAction={tradeAction} />;
    }
    case 'adjust-order': {
      return <ManualTradeActionItemAdjustOrder tradeAction={tradeAction} />;
    }
    case 'adjust-trade': {
      return <ManualTradeActionItemAdjustTrade tradeAction={tradeAction} />;
    }
    default: {
      invariant(
        false,
        `Invalid trade action kind for manual action display: '${kind}'.`,
      );
    }
  }
}
