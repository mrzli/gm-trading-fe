import React from 'react';
import { TradeActionCreateOrder } from '../../../../types';

export interface ManualTradeActionItemCreateOrderProps {
  readonly tradeAction: TradeActionCreateOrder;
}

export function ManualTradeActionItemCreateOrder({
  tradeAction
}: ManualTradeActionItemCreateOrderProps): React.ReactElement {
  return <div>{'ManualTradeActionItemCreateOrder'}</div>;
}
