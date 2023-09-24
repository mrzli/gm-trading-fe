import axios, { AxiosInstance } from 'axios';
import { AppConfig } from './app-config';

export function createServer(config: AppConfig): AxiosInstance {
  return axios.create({
    baseURL: config.backendBaseUrl,
    headers: {
      // Authorization: '',
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
}
