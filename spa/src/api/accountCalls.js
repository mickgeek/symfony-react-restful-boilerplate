// @flow

import { URL_API_BASE } from '../constants/callConstants';
import { getAccessToken } from '../utils/userHelper';

import type { ResponseBody } from './callTypes.js.flow';

export type PasswordChangeFormData = {|
  +passwordChange: {| +currentPassword: string, +newPassword: string |},
|};

export function index(): Promise<ResponseBody> {
  const request = new Request(`${URL_API_BASE}/account`, {
    headers: new Headers({ Authorization: `Bearer ${getAccessToken()}` }),
  });

  return fetch(request)
    .then(response => response.json()
      .then(body => ({ status: response.status, body })),
    );
}

export function update(formData: PasswordChangeFormData): Promise<ResponseBody> {
  const request = new Request(`${URL_API_BASE}/account`, {
    method: 'PATCH',
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAccessToken()}`,
    }),
    body: JSON.stringify(formData),
  });

  return fetch(request)
    .then(response => response.json()
      .then(body => ({ status: response.status, body })),
    );
}

export default { index, update };
