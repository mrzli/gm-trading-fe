import { AxiosInstance } from 'axios';
import {
  ExampleApi,
  InstrumentApi,
  TickerDataApi,
  TradeApi,
  createExampleApi,
  createInstrumentApi,
  createTickerDataApi,
  createTradeApi,
} from './parts';

export interface AppApi {
  readonly example: ExampleApi;
  readonly instrument: InstrumentApi;
  readonly tickerData: TickerDataApi;
  readonly trade: TradeApi;
}

export function createAppApi(server: AxiosInstance): AppApi {
  return {
    example: createExampleApi(server),
    instrument: createInstrumentApi(server),
    tickerData: createTickerDataApi(server),
    trade: createTradeApi(server),
  };
}
