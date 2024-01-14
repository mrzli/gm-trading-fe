export interface Bar {
  readonly time: number;
  readonly open: number;
  readonly high: number;
  readonly low: number;
  readonly close: number;
}

export type Bars = readonly Bar[];

export type GroupedBars = readonly Bars[];
