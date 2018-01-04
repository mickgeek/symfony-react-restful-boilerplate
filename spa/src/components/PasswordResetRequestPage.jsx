// @flow

import React from 'react';

import PasswordResetRequestForm from './PasswordResetRequestForm';
import withRedirectionIfAuthenticated from './withRedirectionIfAuthenticated';

function PasswordResetRequestPage(): React$Node {
  return (
    <main>
      <h1 className="mb-4">Request password reset</h1>
      <div className="row">
        <div className="col col-md-6">
          <PasswordResetRequestForm />
        </div>
      </div>
    </main>
  );
}

export default withRedirectionIfAuthenticated(PasswordResetRequestPage);
