import {
  ManualTradeActionAmendOrder,
  ManualTradeActionAmendTrade,
  ManualTradeActionCancelOrder,
  ManualTradeActionCloseTrade,
  ManualTradeActionOpen,
} from '@gmjs/gm-trading-shared';

export interface ManualTradeActionsByType {
  readonly open: readonly ManualTradeActionOpen[];
  readonly amendOrder: readonly ManualTradeActionAmendOrder[];
  readonly cancelOrder: readonly ManualTradeActionCancelOrder[];
  readonly amendTrade: readonly ManualTradeActionAmendTrade[];
  readonly closeTrade: readonly ManualTradeActionCloseTrade[];
}
