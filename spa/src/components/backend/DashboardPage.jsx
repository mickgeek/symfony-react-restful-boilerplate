// @flow

import React from 'react';

import withErrorIfWrongRole from '../withErrorIfWrongRole';
import { ROLE_SUPER_ADMIN } from '../../constants/userConstants';

function DashboardPage(): React$Node {
  return (
    <main>
      <h1 className="mb-4">Welcome!</h1>
      <p>Are you ready to make the content awesome?</p>
    </main>
  );
}

export default withErrorIfWrongRole(DashboardPage, [ROLE_SUPER_ADMIN]);
