export type TradeLineType = 'solid' | 'dashed';

export interface TradeLine {
  readonly startIndex: number;
  readonly endIndex: number;
  readonly price: number;
  readonly type: TradeLineType;
}
