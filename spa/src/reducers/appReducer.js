// @flow

import { LOCATION_CHANGE } from 'react-router-redux';

import {
  APP_ERROR_CODE_UPDATE,
  APP_NOTIFICATIONS_ADD,
  APP_NOTIFICATIONS_REMOVE,
} from '../constants/actionTypeConstants';

import type { AppState } from './reducerTypes.js.flow';
import type { AppAction } from '../actions/actionCreatorTypes.js.flow';

const initialState = { errorCode: null, notifications: [] };

export default function reduce(state: AppState = initialState, action: AppAction): AppState {
  switch (action.type) {
    case LOCATION_CHANGE:
      return {
        ...initialState,
        notifications: state.notifications.filter(item => (item.redirect)).map(item => ({ ...item, redirect: false })),
      };
    case APP_ERROR_CODE_UPDATE:
      return { ...state, errorCode: action.code };
    case APP_NOTIFICATIONS_ADD:
      return {
        ...state,
        notifications: [
          ...state.notifications,
          { tag: action.tag, message: action.message, redirect: action.redirect },
        ],
      };
    case APP_NOTIFICATIONS_REMOVE: {
      const target = action.index;
      return { ...state, notifications: state.notifications.filter((item, index) => index !== target) };
    }
    default:
      return state;
  }
}
