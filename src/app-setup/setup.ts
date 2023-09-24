import { createAppGlobals } from './app-globals';
import { createAppConfig } from './app-config';
import { AppEnv } from './app-env';
import { AppParams } from './app-params';
import { createAppContext } from './app-context';
import { createAppDependencies } from './app-dependencies';
import { createAppStore } from '../store';

export async function setupApp(env: AppEnv): Promise<AppParams> {
  const config = createAppConfig(env);
  const globals = createAppGlobals(config);
  const dependencies = createAppDependencies(config);

  const store = createAppStore(dependencies);

  const context = createAppContext(globals, store, dependencies);

  return {
    context,
  };
}
