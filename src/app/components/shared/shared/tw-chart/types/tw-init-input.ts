import { TickerDataRow } from '../../../../../types';

export interface TwInitInput {
  readonly precision: number;
  readonly data: readonly TickerDataRow[];
}
