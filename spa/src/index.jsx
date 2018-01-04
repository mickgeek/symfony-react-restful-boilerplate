// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';

import App from './components/App';
import store from './utils/store';
import history from './utils/history';

function render(Component: React$ComponentType<*>): void {
  const root = document.getElementById('react-root');
  if (!(root instanceof HTMLDivElement)) {
    throw new TypeError('Invalid instance type.');
  }

  ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Component />
      </ConnectedRouter>
    </Provider>,
    root,
  );
}

render(App);

// HMR
if (module.hot) {
  module.hot.accept('./components/App', () => { render(App); });
}
