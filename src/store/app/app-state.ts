import { StateExample, StateTickerData } from '../parts';

export interface AppState {
  readonly example: StateExample;
  readonly tickerData: StateTickerData;
}
