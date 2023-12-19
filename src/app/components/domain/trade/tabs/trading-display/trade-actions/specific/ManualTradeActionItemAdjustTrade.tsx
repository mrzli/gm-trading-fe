import React from 'react';
import { TradeActionAdjustTrade } from '../../../../types';

export interface ManualTradeActionItemAdjustTradeProps {
  readonly tradeAction: TradeActionAdjustTrade;
}

export function ManualTradeActionItemAdjustTrade({
  tradeAction,
}: ManualTradeActionItemAdjustTradeProps): React.ReactElement {
  return <div>{'ManualTradeActionItemAdjustTrade'}</div>;
}
