import { APP_ENV, AppEnv, renderApp, setupApp } from './app-setup';
import './index.css';

async function startApp(env: AppEnv): Promise<void> {
  const params = await setupApp(env);
  renderApp(params);
}

startApp(APP_ENV);
