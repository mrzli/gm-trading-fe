import { AppEnv } from './app-env';

export interface AppConfig {
  readonly mode: string;
  readonly backendBaseUrl: string;
}

export function createAppConfig(env: AppEnv): AppConfig {
  return {
    mode: env.mode,
    backendBaseUrl: env.backendBaseUrl,
  };
}
