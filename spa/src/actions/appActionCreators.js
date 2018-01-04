// @flow

import { APP_ERROR_CODE_UPDATE, APP_NOTIFICATIONS_REMOVE } from '../constants/actionTypeConstants';

import type {
  AppErrorCodeUpdatingAction,
  AppNotificationRemovingAction,
} from '../actions/actionCreatorTypes.js.flow';

export function updateErrorCode(code: number): AppErrorCodeUpdatingAction {
  return { type: APP_ERROR_CODE_UPDATE, code };
}

export function removeNotification(index: number): AppNotificationRemovingAction {
  return { type: APP_NOTIFICATIONS_REMOVE, index };
}

export default { updateErrorCode, removeNotification };
