// @flow

import { push } from 'react-router-redux';

import type { Dispatch } from 'redux';

import {
  APP_NOTIFICATIONS_ADD,
  USER_IDENTITY_UPDATE,
  USER_ACCOUNT_UPDATE,
  USER_TOKEN_UPDATE,
  USER_LIST_UPDATE,
  USER_DETAILS_UPDATE,
  LOGIN_FORM_UPDATE,
  PASSWORD_RESET_REQUEST_FORM_UPDATE,
  PASSWORD_RESET_FORM_UPDATE,
  REGISTRATION_FORM_UPDATE,
  PASSWORD_CHANGE_FORM_UPDATE,
  EMAIL_CHANGE_FORM_UPDATE,
  BACKEND_USER_CREATION_FORM_UPDATE,
  BACKEND_USER_UPDATING_FORM_UPDATE,
} from '../constants/actionTypeConstants';
import {
  ROUTE_HOME,
  ROUTE_LOGIN,
  ROUTE_SETTINGS,
  BACKEND_ROUTE_USER_LIST,
} from '../constants/routeConstants';
import { create as createAuthorization } from '../api/authorizationCalls';
import { index, create, read, update, destroy } from '../api/userCalls';
import { index as indexAccount, update as updateAccount } from '../api/accountCalls';
import {
  create as createToken,
  read as readToken,
  updateAccountActivation,
  updatePasswordReset,
  updateEmailChange,
} from '../api/userTokenCalls';

import type {
  AppNotificationAddingAction,
  UserIdentityUpdatingAction,
  UserAccountUpdatingAction,
  UserTokenUpdatingAction,
  UserListUpdatingAction,
  UserDetailsUpdatingAction,
  RegistrationFormUpdatingAction,
  LoginFormUpdatingAction,
  PasswordResetRequestFormUpdatingAction,
  PasswordResetFormUpdatingAction,
  PasswordChangeFormUpdatingAction,
  EmailChangeFormUpdatingAction,
  BackendUserCreationFormUpdatingAction,
  BackendUserUpdatingFormUpdatingAction,
} from '../actions/actionCreatorTypes.js.flow';
import type { LoginFormData } from '../api/authorizationCalls';
import type { RegistrationFormData, BackendUserCreatingFormData, BackendUserUpdatingFormData } from '../api/userCalls';
import type { PasswordChangeFormData } from '../api/accountCalls';
import type { PasswordResetRequestFormData, EmailChangeFormData, PasswordResetFormData } from '../api/userTokenCalls';

type LoginAction =
  | UserIdentityUpdatingAction
  | LoginFormUpdatingAction;

export function logIn(formData: LoginFormData): Function {
  return (dispatch: Dispatch<LoginAction>): Promise<void> => createAuthorization(formData)
    .then((response) => {
      switch (response.status) {
        case 201:
          dispatch({ type: USER_IDENTITY_UPDATE, token: response.body.attributes.accessToken });
          dispatch(push(ROUTE_HOME));
          break;
        case 401:
          dispatch({
            type: LOGIN_FORM_UPDATE,
            errors: {
              email: [response.body.message],
              password: [' '],
            },
          });
          break;
        default:
          throw new Error('Unexpected response returned.');
      }
    });
}

export function logOut(): Function {
  return (dispatch: Dispatch<UserIdentityUpdatingAction>): void => {
    dispatch({ type: USER_IDENTITY_UPDATE, token: null });
    dispatch(push(ROUTE_HOME));
  };
}

type RegistrationAction =
  | AppNotificationAddingAction
  | RegistrationFormUpdatingAction;

export function register(formData: RegistrationFormData): Function {
  return (dispatch: Dispatch<RegistrationAction>): Promise<void> => create(formData, false)
    .then((response) => {
      switch (response.status) {
        case 201:
          dispatch({ type: REGISTRATION_FORM_UPDATE, errors: {}, reset: true });
          dispatch({
            type: APP_NOTIFICATIONS_ADD,
            tag: 'success',
            message: 'A message with a confirmation link has been sent to your email.',
            redirect: false,
          });
          break;
        case 422:
          dispatch({ type: REGISTRATION_FORM_UPDATE, errors: response.body.errors, reset: false });
          break;
        default:
          throw new Error('Unexpected response returned.');
      }
    });
}

export function view(): Function {
  return (dispatch: Dispatch<UserListUpdatingAction>): Promise<void> => index()
    .then((response) => {
      switch (response.status) {
        case 200: {
          dispatch({ type: USER_LIST_UPDATE, items: response.body.items, message: null });
          break;
        }
        case 404: {
          dispatch({ type: USER_LIST_UPDATE, items: [], message: response.body.message });
          break;
        }
        default:
          throw new Error('Unexpected response returned.');
      }
    });
}

export function viewOne(id: number): Function {
  return (dispatch: Dispatch<UserDetailsUpdatingAction>): Promise<void> => read(id)
    .then((response) => {
      switch (response.status) {
        case 200:
          dispatch({ type: USER_DETAILS_UPDATE, attributes: response.body.attributes, message: null });
          break;
        case 404:
          dispatch({ type: USER_DETAILS_UPDATE, attributes: {}, message: response.body.message });
          break;
        default:
          throw new Error('Unexpected response returned.');
      }
    });
}

type AccountViewAction =
  | UserIdentityUpdatingAction
  | UserAccountUpdatingAction;

export function viewAccount(): Function {
  return (dispatch: Dispatch<AccountViewAction>): Promise<void> => indexAccount()
    .then((response) => {
      switch (response.status) {
        case 200:
          dispatch({ type: USER_ACCOUNT_UPDATE, attributes: response.body.attributes });
          break;
        case 401:
          dispatch({ type: USER_IDENTITY_UPDATE, token: null });
          dispatch(push(ROUTE_LOGIN));
          break;
        default:
          throw new Error('Unexpected response returned.');
      }
    });
}

type PasswordChangeAction =
  | AppNotificationAddingAction
  | UserIdentityUpdatingAction
  | PasswordChangeFormUpdatingAction;

export function changePassword(formData: PasswordChangeFormData): Function {
  return (dispatch: Dispatch<PasswordChangeAction>): Promise<void> => updateAccount(formData)
    .then((response) => {
      switch (response.status) {
        case 200:
          dispatch({ type: PASSWORD_CHANGE_FORM_UPDATE, errors: {}, reset: true });
          dispatch({
            type: APP_NOTIFICATIONS_ADD,
            tag: 'success',
            message: 'Your password has been changed successfully.',
            redirect: false,
          });
          break;
        case 401:
          dispatch({ type: USER_IDENTITY_UPDATE, token: null });
          dispatch(push(ROUTE_LOGIN));
          break;
        case 422:
          dispatch({ type: PASSWORD_CHANGE_FORM_UPDATE, errors: response.body.errors, reset: false });
          break;
        default:
          throw new Error('Unexpected response returned.');
      }
    });
}

type PasswordResetRequestAction =
  | AppNotificationAddingAction
  | PasswordResetRequestFormUpdatingAction;

export function requestPasswordReset(formData: PasswordResetRequestFormData): Function {
  return (dispatch: Dispatch<PasswordResetRequestAction>): Promise<void> => createToken(formData, false)
    .then((response) => {
      switch (response.status) {
        case 200:
          dispatch({ type: PASSWORD_RESET_REQUEST_FORM_UPDATE, errors: {}, reset: true });
          dispatch({
            type: APP_NOTIFICATIONS_ADD,
            tag: 'success',
            message: 'A message with a confirmation link has been sent to your email.',
            redirect: false,
          });
          break;
        case 422:
          dispatch({ type: PASSWORD_RESET_REQUEST_FORM_UPDATE, errors: response.body.errors, reset: false });
          break;
        default:
          throw new Error('Unexpected response returned.');
      }
    });
}

type EmailChangeAction =
  | AppNotificationAddingAction
  | UserIdentityUpdatingAction
  | EmailChangeFormUpdatingAction;

export function changeEmail(formData: EmailChangeFormData): Function {
  return (dispatch: Dispatch<EmailChangeAction>): Promise<void> => createToken(formData, true)
    .then((response) => {
      switch (response.status) {
        case 200:
          dispatch({ type: EMAIL_CHANGE_FORM_UPDATE, errors: {}, reset: true });
          dispatch({
            type: APP_NOTIFICATIONS_ADD,
            tag: 'success',
            message: 'A message with a confirmation link has been sent to your email.',
            redirect: false,
          });
          break;
        case 401:
          dispatch({ type: USER_IDENTITY_UPDATE, token: null });
          dispatch(push(ROUTE_LOGIN));
          break;
        case 422:
          dispatch({ type: EMAIL_CHANGE_FORM_UPDATE, errors: response.body.errors, reset: false });
          break;
        default:
          throw new Error('Unexpected response returned.');
      }
    });
}

export function viewToken(token: string): Function {
  return (dispatch: Dispatch<UserTokenUpdatingAction>): Promise<void> => readToken(token)
    .then((response) => {
      switch (response.status) {
        case 200:
          dispatch({
            type: USER_TOKEN_UPDATE,
            attributes: {
              isUsed: Boolean(response.body.attributes.usedAt),
              isExpired: response.body.attributes.isExpired,
            },
            message: null,
          });
          break;
        case 404:
          dispatch({ type: USER_TOKEN_UPDATE, attributes: {}, message: response.body.message });
          break;
        default:
          throw new Error('Unexpected response returned.');
      }
    });
}

type AccountActivationConfirmationAction =
  | AppNotificationAddingAction
  | UserTokenUpdatingAction;

export function confirmAccountActivation(token: string): Function {
  return (dispatch: Dispatch<AccountActivationConfirmationAction>): Promise<void> => updateAccountActivation(token)
    .then((response) => {
      switch (response.status) {
        case 200:
          dispatch({
            type: APP_NOTIFICATIONS_ADD,
            tag: 'success',
            message: 'Your account has been activated successfully.',
            redirect: true,
          });
          dispatch(push(ROUTE_LOGIN));
          break;
        case 404:
          dispatch({ type: USER_TOKEN_UPDATE, attributes: {}, message: response.body.message });
          break;
        case 410:
          dispatch({
            type: USER_TOKEN_UPDATE,
            attributes: {
              isUsed: true,
              isExpired: false,
            },
            message: null,
          });
          break;
        default:
          throw new Error('Unexpected response returned.');
      }
    });
}

type PasswordResetAction =
  | AppNotificationAddingAction
  | UserTokenUpdatingAction
  | PasswordResetFormUpdatingAction;

export function resetPassword(token: string, formData: PasswordResetFormData): Function {
  return (dispatch: Dispatch<PasswordResetAction>): Promise<void> => updatePasswordReset(token, formData)
    .then((response) => {
      switch (response.status) {
        case 200:
          dispatch({
            type: APP_NOTIFICATIONS_ADD,
            tag: 'success',
            message: 'Your password has been reset successfully.',
            redirect: true,
          });
          dispatch(push(ROUTE_LOGIN));
          break;
        case 404:
          dispatch({ type: USER_TOKEN_UPDATE, attributes: {}, message: response.body.message });
          break;
        case 410:
          dispatch({
            type: USER_TOKEN_UPDATE,
            attributes: {
              isUsed: response.body.code === 'token_used',
              isExpired: response.body.code === 'token_expired',
            },
            message: null,
          });
          break;
        case 422:
          dispatch({ type: PASSWORD_RESET_FORM_UPDATE, errors: response.body.errors });
          break;
        default:
          throw new Error('Unexpected response returned.');
      }
    });
}

type EmailChangeConfirmationAction =
  | AppNotificationAddingAction
  | UserIdentityUpdatingAction
  | UserTokenUpdatingAction;

export function confirmEmailChange(token: string): Function {
  return (dispatch: Dispatch<EmailChangeConfirmationAction>): Promise<void> => updateEmailChange(token)
    .then((response) => {
      switch (response.status) {
        case 200:
          dispatch({
            type: APP_NOTIFICATIONS_ADD,
            tag: 'success',
            message: 'Your email has been changed successfully.',
            redirect: true,
          });
          dispatch(push(ROUTE_SETTINGS));
          break;
        case 401:
          dispatch({ type: USER_IDENTITY_UPDATE, token: null });
          dispatch(push(ROUTE_LOGIN));
          break;
        case 404:
          dispatch({ type: USER_TOKEN_UPDATE, attributes: {}, message: response.body.message });
          break;
        case 410:
          dispatch({
            type: USER_TOKEN_UPDATE,
            attributes: {
              isUsed: response.body.code === 'token_used',
              isExpired: response.body.code === 'token_expired',
            },
            message: null,
          });
          break;
        default:
          throw new Error('Unexpected response returned.');
      }
    });
}

type BackendCreationAction =
  | AppNotificationAddingAction
  | UserIdentityUpdatingAction
  | BackendUserCreationFormUpdatingAction;

export function backendCreate(formData: BackendUserCreatingFormData): Function {
  return (dispatch: Dispatch<BackendCreationAction>): Promise<void> => create(formData, true)
    .then((response) => {
      switch (response.status) {
        case 201:
          dispatch({ type: BACKEND_USER_CREATION_FORM_UPDATE, errors: {} });
          dispatch({
            type: APP_NOTIFICATIONS_ADD,
            tag: 'success',
            message: 'The user has been created successfully.',
            redirect: true,
          });
          dispatch(push(BACKEND_ROUTE_USER_LIST));
          break;
        case 401:
          dispatch({ type: USER_IDENTITY_UPDATE, token: null });
          dispatch(push(ROUTE_LOGIN));
          break;
        case 422:
          dispatch({ type: BACKEND_USER_CREATION_FORM_UPDATE, errors: response.body.errors });
          break;
        default:
          throw new Error('Unexpected response returned.');
      }
    });
}

type BackendUpdatingAction =
  | AppNotificationAddingAction
  | UserIdentityUpdatingAction
  | BackendUserUpdatingFormUpdatingAction;

export function backendUpdate(id: string, formData: BackendUserUpdatingFormData): Function {
  return (dispatch: Dispatch<BackendUpdatingAction>): Promise<void> => update(id, formData)
    .then((response) => {
      switch (response.status) {
        case 200:
          dispatch({ type: BACKEND_USER_UPDATING_FORM_UPDATE, errors: {} });
          dispatch({
            type: APP_NOTIFICATIONS_ADD,
            tag: 'success',
            message: 'The user has been updated successfully.',
            redirect: true,
          });
          dispatch(push(BACKEND_ROUTE_USER_LIST));
          break;
        case 401:
          dispatch({ type: USER_IDENTITY_UPDATE, token: null });
          dispatch(push(ROUTE_LOGIN));
          break;
        case 422:
          dispatch({ type: BACKEND_USER_UPDATING_FORM_UPDATE, errors: response.body.errors });
          break;
        default:
          throw new Error('Unexpected response returned.');
      }
    });
}

type BackendDestructionAction =
  | AppNotificationAddingAction
  | UserIdentityUpdatingAction;

export function backendDestroy(id: string): Function {
  return (dispatch: Dispatch<BackendDestructionAction>): Promise<void> => destroy(id)
    .then((response) => {
      switch (response.status) {
        case 204:
          dispatch({
            type: APP_NOTIFICATIONS_ADD,
            tag: 'success',
            message: 'The user has been deleted successfully.',
            redirect: true,
          });
          dispatch(push(BACKEND_ROUTE_USER_LIST));
          break;
        case 401:
          dispatch({ type: USER_IDENTITY_UPDATE, token: null });
          dispatch(push(ROUTE_LOGIN));
          break;
        case 404:
          dispatch({
            type: APP_NOTIFICATIONS_ADD,
            tag: 'danger',
            message: 'The user does not exist.',
            redirect: false,
          });
          break;
        default:
          throw new Error('Unexpected response returned.');
      }
    });
}

export default {
  logIn,
  logOut,

  register,
  view,
  viewOne,

  viewAccount,
  changePassword,

  requestPasswordReset,
  changeEmail,
  viewToken,
  confirmAccountActivation,
  resetPassword,
  confirmEmailChange,

  backendCreate,
  backendUpdate,
  backendDestroy,
};
