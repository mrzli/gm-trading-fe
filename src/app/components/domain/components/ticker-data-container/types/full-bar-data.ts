import { GroupedBars, Bars } from '../../../types';

export interface FullBarData {
  readonly subRows: GroupedBars;
  readonly rows: Bars;
}
