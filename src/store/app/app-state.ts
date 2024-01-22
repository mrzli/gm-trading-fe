import {
  StateExample,
  StateInstrument,
  StateTickerData,
  StateTrade,
} from '../parts';

export interface AppState {
  readonly example: StateExample;
  readonly instrument: StateInstrument;
  readonly tickerData: StateTickerData;
  readonly trade: StateTrade;
}
