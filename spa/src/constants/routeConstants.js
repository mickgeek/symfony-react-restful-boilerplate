// @flow

export const ROUTE_HOME = '/';
export const ROUTE_LOGIN = '/log-in';
export const ROUTE_PASSWORD_RESET_REQUEST = '/restore-password';
export const ROUTE_PASSWORD_RESET = '/restore-password/:token';
export const ROUTE_REGISTRATION = '/register';
export const ROUTE_ACCOUNT_ACTIVATION_CONFIRMATION = '/register/:token';
export const ROUTE_SETTINGS = '/settings';
export const ROUTE_EMAIL_CHANGE_CONFIRMATION = '/settings/:token';
export const ROUTE_USER_LIST = '/users';
export const ROUTE_USER_DETAILS = '/users/:id';

export const BACKEND_ROUTE_DASHBOARD = '/admin';
export const BACKEND_ROUTE_USER_LIST = '/admin/users';
export const BACKEND_ROUTE_USER_CREATION = '/admin/users/create';
export const BACKEND_ROUTE_USER_DETAILS = '/admin/users/:id';

export default {
  ROUTE_HOME,
  ROUTE_LOGIN,
  ROUTE_PASSWORD_RESET_REQUEST,
  ROUTE_PASSWORD_RESET,
  ROUTE_REGISTRATION,
  ROUTE_ACCOUNT_ACTIVATION_CONFIRMATION,
  ROUTE_SETTINGS,
  ROUTE_EMAIL_CHANGE_CONFIRMATION,
  ROUTE_USER_LIST,
  ROUTE_USER_DETAILS,

  BACKEND_ROUTE_DASHBOARD,
  BACKEND_ROUTE_USER_LIST,
  BACKEND_ROUTE_USER_CREATION,
  BACKEND_ROUTE_USER_DETAILS,
};
