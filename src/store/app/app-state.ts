import {
  StateExample,
  StateInstrument,
  StateStrategy,
  StateTickerData,
  StateTrade,
} from '../parts';

export interface AppState {
  readonly example: StateExample;
  readonly instrument: StateInstrument;
  readonly strategy: StateStrategy;
  readonly tickerData: StateTickerData;
  readonly trade: StateTrade;
}
