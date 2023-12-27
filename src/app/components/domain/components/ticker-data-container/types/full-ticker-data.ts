import { GroupedBars, Bars } from '../../../types';

export interface FullTickerData {
  readonly subRows: GroupedBars;
  readonly rows: Bars;
}
