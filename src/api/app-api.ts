import { AxiosInstance } from 'axios';
import {
  ExampleApi,
  TickerDataApi,
  createExampleApi,
  createTickerDataApi,
} from './parts';

export interface AppApi {
  readonly example: ExampleApi;
  readonly tickerData: TickerDataApi;
}

export function createAppApi(server: AxiosInstance): AppApi {
  return {
    example: createExampleApi(server),
    tickerData: createTickerDataApi(server),
  };
}
