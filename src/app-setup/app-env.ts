import { z } from 'zod';

const APP_ENV_SCHEMA = z.object({
  MODE: z.string(),
  BASE_URL: z.string(),
  PROD: z.boolean(),
  DEV: z.boolean(),
  SSR: z.boolean(),
  VITE_BACKEND_BASE_URL: z.string().url(),
});

type AppEnvRaw = z.infer<typeof APP_ENV_SCHEMA>;

export interface AppEnv {
  readonly mode: string;
  readonly baseUrl: string;
  readonly prod: boolean;
  readonly dev: boolean;
  readonly ssr: boolean;
  readonly backendBaseUrl: string;
}

function getAppEnv(): AppEnv {
  const raw: AppEnvRaw = APP_ENV_SCHEMA.parse({
    MODE: import.meta.env.MODE,
    BASE_URL: import.meta.env.BASE_URL,
    PROD: import.meta.env.PROD,
    DEV: import.meta.env.DEV,
    SSR: import.meta.env.SSR,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    VITE_BACKEND_BASE_URL: import.meta.env.VITE_BACKEND_BASE_URL,
  });

  return envRawToEnv(raw);
}

function envRawToEnv(raw: AppEnvRaw): AppEnv {
  return {
    mode: raw.MODE,
    baseUrl: raw.BASE_URL,
    prod: raw.PROD,
    dev: raw.DEV,
    ssr: raw.SSR,
    backendBaseUrl: raw.VITE_BACKEND_BASE_URL,
  };
}

export const APP_ENV = getAppEnv();
