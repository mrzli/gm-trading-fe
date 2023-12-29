import {
  ManualTradeActionAmendOrder,
  ManualTradeActionAmendTrade,
  ManualTradeActionCancelOrder,
  ManualTradeActionCloseTrade,
  ManualTradeActionOpen,
} from './manual-trade-action';

export interface ManualTradeActionsByType {
  readonly open: readonly ManualTradeActionOpen[];
  readonly amendOrder: readonly ManualTradeActionAmendOrder[];
  readonly cancelOrder: readonly ManualTradeActionCancelOrder[];
  readonly amendTrade: readonly ManualTradeActionAmendTrade[];
  readonly closeTrade: readonly ManualTradeActionCloseTrade[];
}
