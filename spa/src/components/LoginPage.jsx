// @flow

import React from 'react';
import { Link } from 'react-router-dom';

import LoginForm from './LoginForm';
import { ROUTE_PASSWORD_RESET_REQUEST } from '../constants/routeConstants';
import withRedirectionIfAuthenticated from './withRedirectionIfAuthenticated';

function LoginPage(): React$Node {
  return (
    <main>
      <h1 className="mb-4">Log in</h1>
      <div className="row">
        <div className="col col-md-6">
          <LoginForm />
          <div className="mt-2">
            <Link to={ROUTE_PASSWORD_RESET_REQUEST}>Forgot password?</Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default withRedirectionIfAuthenticated(LoginPage);
