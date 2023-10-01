import { StateExample, StateInstrument, StateTickerData } from '../parts';

export interface AppState {
  readonly example: StateExample;
  readonly instrument: StateInstrument;
  readonly tickerData: StateTickerData;
}
