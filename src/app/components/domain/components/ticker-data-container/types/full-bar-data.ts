import { GroupedBars, Bars } from '../../../types';

export interface FullBarData {
  readonly subBars: GroupedBars;
  readonly bars: Bars;
}
