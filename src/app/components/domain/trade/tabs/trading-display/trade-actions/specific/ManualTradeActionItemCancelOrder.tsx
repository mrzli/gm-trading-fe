import React from 'react';
import { TradeActionCancelOrder } from '../../../../types';

export interface ManualTradeActionItemCancelOrderProps {
  readonly tradeAction: TradeActionCancelOrder;
}

export function ManualTradeActionItemCancelOrder({
  tradeAction
}: ManualTradeActionItemCancelOrderProps): React.ReactElement {
  return <div>{'ManualTradeActionItemCancelOrder'}</div>;
}
