import { AxiosInstance } from 'axios';
import {
  ExampleApi,
  InstrumentApi,
  StrategyApi,
  TickerDataApi,
  TradeApi,
  createExampleApi,
  createInstrumentApi,
  createStrategyApi,
  createTickerDataApi,
  createTradeApi,
} from './parts';

export interface AppApi {
  readonly example: ExampleApi;
  readonly instrument: InstrumentApi;
  readonly strategy: StrategyApi;
  readonly tickerData: TickerDataApi;
  readonly trade: TradeApi;
}

export function createAppApi(server: AxiosInstance): AppApi {
  return {
    example: createExampleApi(server),
    instrument: createInstrumentApi(server),
    strategy: createStrategyApi(server),
    tickerData: createTickerDataApi(server),
    trade: createTradeApi(server),
  };
}
