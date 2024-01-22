import { TradeState } from '@gmjs/gm-trading-shared';
import { AxiosInstance } from 'axios';

export interface TradeApi {
  readonly getTradeStates: () => Promise<readonly TradeState[]>;
  readonly saveTradeState: (tradeState: TradeState) => Promise<void>;
}

export function createTradeApi(server: AxiosInstance): TradeApi {
  return {
    async getTradeStates(): Promise<readonly TradeState[]> {
      const response = await server.get<readonly TradeState[]>(
        'api/trade/trade-states',
      );
      return response.data;
    },
    async saveTradeState(tradeState: TradeState): Promise<void> {
      await server.post('api/trade/save-trade-state', tradeState);
    },
  };
}
