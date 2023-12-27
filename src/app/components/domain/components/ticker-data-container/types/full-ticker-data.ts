import { GroupedTickerDataRows, TickerDataRows } from '../../../types';

export interface FullTickerData {
  readonly subRows: GroupedTickerDataRows;
  readonly rows: TickerDataRows;
}
