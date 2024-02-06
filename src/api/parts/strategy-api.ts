import { AxiosInstance } from 'axios';
import {
  RunStrategyRequest,
  RunStrategyResponse,
} from '@gmjs/gm-trading-shared';

export interface StrategyApi {
  readonly runStrategy: (
    data: RunStrategyRequest,
  ) => Promise<RunStrategyResponse>;
}

export function createStrategyApi(server: AxiosInstance): StrategyApi {
  return {
    async runStrategy(data: RunStrategyRequest): Promise<RunStrategyResponse> {
      const response = await server.post<RunStrategyResponse>(
        'api/strategy/run-strategy',
        data,
      );
      return response.data;
    },
  };
}
