import { TickerDataRequest, TickerDataResponse } from '@gmjs/gm-trading-shared';
import { AxiosInstance } from 'axios';

export interface TickerDataApi {
  readonly getTickerData: (
    data: TickerDataRequest,
  ) => Promise<TickerDataResponse>;
}

export function createTickerDataApi(server: AxiosInstance): TickerDataApi {
  return {
    async getTickerData(data: TickerDataRequest): Promise<TickerDataResponse> {
      const response = await server.post<TickerDataResponse>(
        'api/ticker-data/ticker-data',
        data
      );
      return response.data;
    },
  };
}
