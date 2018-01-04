// @flow

import { URL_API_BASE } from '../constants/callConstants';

import type { ResponseBody } from './callTypes.js.flow';

export type LoginFormData = {| +email: string, +password: string |};

export function create(formData: LoginFormData): Promise<ResponseBody> {
  const request = new Request(`${URL_API_BASE}/authorizations`, {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(formData),
  });

  return fetch(request)
    .then(response => response.json()
      .then(body => ({ status: response.status, body })),
    );
}

export default { create };
