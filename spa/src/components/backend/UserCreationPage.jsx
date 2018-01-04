// @flow

import React from 'react';

import UserCreationForm from './UserCreationForm';
import withErrorIfWrongRole from '../withErrorIfWrongRole';
import { ROLE_SUPER_ADMIN } from '../../constants/userConstants';

function UserCreationPage(): React$Node {
  return (
    <main>
      <h1 className="mb-4">Create user</h1>
      <UserCreationForm />
    </main>
  );
}

export default withErrorIfWrongRole(UserCreationPage, [ROLE_SUPER_ADMIN]);
