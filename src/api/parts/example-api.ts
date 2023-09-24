import { AxiosInstance } from 'axios';

export interface ExampleApi {
  readonly getExample: () => Promise<string>;
}

export function createExampleApi(server: AxiosInstance): ExampleApi {
  return {
    async getExample(): Promise<string> {
      const response = await server.get<string>('api/example/example');
      return response.data;
    },
  };
}
