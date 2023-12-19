import React from 'react';
import { TradeActionAdjustOrder } from '../../../../types';

export interface ManualTradeActionItemAdjustOrderProps {
  readonly tradeAction: TradeActionAdjustOrder;
}

export function ManualTradeActionItemAdjustOrder({
  tradeAction
}: ManualTradeActionItemAdjustOrderProps): React.ReactElement {
  return <div>{'ManualTradeActionItemAdjustOrder'}</div>;
}
