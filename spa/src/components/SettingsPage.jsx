// @flow

import React from 'react';

import PasswordChangeForm from './PasswordChangeForm';
import EmailChangeForm from './EmailChangeForm';
import withErrorIfWrongRole from './withErrorIfWrongRole';

function SettingsPage(): React$Node {
  return (
    <main>
      <h1 className="mb-4">Settings</h1>
      <div className="row">
        <div className="col col-md-6">
          <h2 className="mb-4">Change password</h2>
          <PasswordChangeForm />
        </div>
      </div>
      <div className="row mt-4">
        <div className="col col-md-6">
          <h2 className="mb-4">Change email</h2>
          <EmailChangeForm />
        </div>
      </div>
    </main>
  );
}

export default withErrorIfWrongRole(SettingsPage);
