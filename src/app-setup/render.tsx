import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AppContext } from './app-context';
import { AppParams } from './app-params';
import { App } from '../app/App';

export function renderApp(params: AppParams): void {
  const { context } = params;

  const root = createReactRoot();

  const wrappedApp = (
    <React.StrictMode>
      <AppContext.Provider value={context}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AppContext.Provider>
    </React.StrictMode>
  );

  root.render(wrappedApp);
}

function createReactRoot(): ReactDOM.Root {
  return ReactDOM.createRoot(document.querySelector('#root') as HTMLElement);
}
