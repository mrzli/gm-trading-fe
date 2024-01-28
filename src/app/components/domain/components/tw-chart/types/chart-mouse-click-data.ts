export interface ChartMouseClickData {
  readonly barIndex: number | undefined;
  readonly price: number | undefined;
}

export type ChartMouseClickFn = (data: ChartMouseClickData) => void;
