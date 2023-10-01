import { AxiosInstance } from 'axios';
import { Instrument } from '@gmjs/gm-trading-shared';

export interface InstrumentApi {
  readonly getAllInstruments: () => Promise<readonly Instrument[]>;
  readonly getInstrumentByName: (name: string) => Promise<Instrument>;
}

export function createInstrumentApi(server: AxiosInstance): InstrumentApi {
  return {
    async getAllInstruments(): Promise<readonly Instrument[]> {
      const response = await server.get<readonly Instrument[]>(
        'api/instrument/all',
      );
      return response.data;
    },
    async getInstrumentByName(name: string): Promise<Instrument> {
      const response = await server.get<Instrument>(
        `api/instrument/by-name/${name}`,
      );
      return response.data;
    },
  };
}
