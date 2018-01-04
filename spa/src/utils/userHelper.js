// @flow

import {
  ROLE_USER,
  ROLE_SUPER_ADMIN,
  STATUS_INACTIVE,
  STATUS_CLOSED,
  STATUS_BLOCKED,
  STATUS_ACTIVE,
} from '../constants/userConstants';
import { decodePayload } from '../utils/jwtHelper';

export type Identity = {| +id: number | null, +email: string | null, +role: number | null, +status: number | null |};

export function setAccessToken(token: string | null): void {
  if (token === null) {
    localStorage.removeItem('jwt');
    return;
  }

  localStorage.setItem('jwt', token);
}

export function getAccessToken(): string {
  const token = localStorage.getItem('jwt');
  if (typeof token !== 'string') {
    throw new Error('Access token is invalid.');
  }

  return token;
}

export function getIdentity(): Identity {
  try {
    const identity = decodePayload(getAccessToken());
    if (identity.exp < Math.round(Date.now() / 1000)) {
      setAccessToken(null);
      throw new Error('Token is expired.');
    }

    return { id: identity.sub, email: identity.email, role: identity.role, status: identity.status };
  } catch (error) {
    return { id: null, email: null, role: null, status: null };
  }
}

export function getValueAlias(group: string, value: number | null = null): Object | string {
  const role = [];
  role[ROLE_USER] = 'User';
  role[ROLE_SUPER_ADMIN] = 'Super Admin';
  const status = [];
  status[STATUS_INACTIVE] = 'Inactive';
  status[STATUS_CLOSED] = 'Closed';
  status[STATUS_BLOCKED] = 'Blocked';
  status[STATUS_ACTIVE] = 'Active';
  const aliases = { role, status };

  return value === null ? aliases[group] : aliases[group][value];
}

export default {
  setAccessToken,
  getAccessToken,
  getIdentity,
  getValueAlias,
};
