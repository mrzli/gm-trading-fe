import { AxiosInstance } from 'axios';
import { ExampleApi, createExampleApi } from './parts';

export interface AppApi {
  readonly example: ExampleApi;
}

export function createAppApi(server: AxiosInstance): AppApi {
  return {
    example: createExampleApi(server),
  };
}
