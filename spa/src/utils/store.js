// @flow

import { combineReducers, applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { routerReducer, routerMiddleware } from 'react-router-redux';

import appReducer from '../reducers/appReducer';
import userReducer from '../reducers/userReducer';
import history from './history';

const rootReducer = combineReducers({
  router: routerReducer,
  app: appReducer,
  user: userReducer,
});
const enhancer = composeWithDevTools(applyMiddleware(thunk, routerMiddleware(history)));

export default createStore(rootReducer, enhancer);
