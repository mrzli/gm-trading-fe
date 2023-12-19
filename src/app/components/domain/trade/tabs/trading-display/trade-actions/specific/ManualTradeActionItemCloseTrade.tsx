import React from 'react';
import { TradeActionCloseTrade } from '../../../../types';

export interface ManualTradeActionItemCloseTradeProps {
  readonly tradeAction: TradeActionCloseTrade;
}

export function ManualTradeActionItemCloseTrade({
  tradeAction
}: ManualTradeActionItemCloseTradeProps): React.ReactElement {
  return <div>{'ManualTradeActionItemCloseTrade'}</div>;
}
