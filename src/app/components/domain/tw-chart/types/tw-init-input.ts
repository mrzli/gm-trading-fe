import { TickerDataRow } from '../../../../types';

export interface TwInitInput {
  readonly precision: number;
  readonly data: readonly TickerDataRow[];
  readonly onCrosshairMove: CrosshairMoveFn;
}

export type CrosshairMoveFn = (item: TickerDataRow | undefined) => void;
