import { AxiosInstance } from 'axios';
import {
  ExampleApi,
  InstrumentApi,
  TickerDataApi,
  createExampleApi,
  createInstrumentApi,
  createTickerDataApi,
} from './parts';

export interface AppApi {
  readonly example: ExampleApi;
  readonly instrument: InstrumentApi;
  readonly tickerData: TickerDataApi;
}

export function createAppApi(server: AxiosInstance): AppApi {
  return {
    example: createExampleApi(server),
    instrument: createInstrumentApi(server),
    tickerData: createTickerDataApi(server),
  };
}
