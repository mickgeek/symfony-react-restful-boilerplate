// @flow

import { URL_API_BASE } from '../constants/callConstants';
import { getAccessToken } from '../utils/userHelper';

import type { ResponseBody } from './callTypes.js.flow';

export type PasswordResetRequestFormData = {| +passwordReset: {| +email: string, +appURL: string |} |};

export type EmailChangeFormData = {| +emailChange: {| +newEmail: string, +appURL: string |} |};

export type PasswordResetFormData = {| +newPassword: string |};

export function create(
  formData: PasswordResetRequestFormData | EmailChangeFormData,
  isAuthenticated: boolean,
): Promise<ResponseBody> {
  let headers = { 'Content-Type': 'application/json' };
  if (isAuthenticated) {
    headers = { ...headers, Authorization: `Bearer ${getAccessToken()}` };
  }
  const request = new Request(`${URL_API_BASE}/user-tokens`, {
    method: 'POST',
    headers: new Headers(headers),
    body: JSON.stringify(formData),
  });

  return fetch(request)
    .then(response => response.json()
      .then(body => ({ status: response.status, body })),
    );
}

export function read(token: string): Promise<ResponseBody> {
  const request = new Request(`${URL_API_BASE}/user-tokens/${token}`);

  return fetch(request)
    .then(response => response.json()
      .then(body => ({ status: response.status, body })),
    );
}

export function updateAccountActivation(token: string): Promise<ResponseBody> {
  const request = new Request(`${URL_API_BASE}/user-tokens/${token}/account-activation`, {
    method: 'PATCH',
  });

  return fetch(request)
    .then(response => response.json()
      .then(body => ({ status: response.status, body })),
    );
}

export function updatePasswordReset(token: string, formData: PasswordResetFormData): Promise<ResponseBody> {
  const request = new Request(`${URL_API_BASE}/user-tokens/${token}/password-reset`, {
    method: 'PATCH',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(formData),
  });

  return fetch(request)
    .then(response => response.json()
      .then(body => ({ status: response.status, body })),
    );
}

export function updateEmailChange(token: string): Promise<ResponseBody> {
  const request = new Request(`${URL_API_BASE}/user-tokens/${token}/email-change`, {
    method: 'PATCH',
    headers: new Headers({ Authorization: `Bearer ${getAccessToken()}` }),
  });

  return fetch(request)
    .then(response => response.json()
      .then(body => ({ status: response.status, body })),
    );
}

export default {
  create,
  read,
  updateAccountActivation,
  updatePasswordReset,
  updateEmailChange,
};
