import { AxiosInstance } from 'axios';

export interface TickerDataApi {
  readonly getTickerData: () => Promise<readonly string[]>;
}

export function createTickerDataApi(server: AxiosInstance): TickerDataApi {
  return {
    async getTickerData(): Promise<readonly string[]> {
      const response = await server.get<readonly string[]>(
        'api/ticker-data/ticker-data',
      );
      return response.data;
    },
  };
}
