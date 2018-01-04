// @flow

import React from 'react';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import type { Dispatch } from 'redux';

import Loading from './Loading';
import Error from './Error';
import PasswordResetForm from './PasswordResetForm';
import withRedirectionIfAuthenticated from './withRedirectionIfAuthenticated';
import userActionCreators from '../actions/userActionCreators';

import type { UserState, RootState } from '../reducers/reducerTypes.js.flow';
import type { UserActionCreators } from '../actions/actionCreatorTypes.js.flow';

type Router = {| +match: Object |};

type MappedState = {| +user: UserState |};

type MappedDispatch = {| +userMethods: UserActionCreators |};

type Props = Router & MappedState & MappedDispatch;

type State = {| isLoaded: boolean, error: string | null |};

class PasswordResetPage extends React.Component<Props, State> {
  state = { isLoaded: false, error: null };

  componentDidMount(): void {
    this.props.userMethods.viewToken(this.props.match.params.token);
  }

  componentWillReceiveProps(nextProps: Props): void {
    if (nextProps.user.token.updatedAt !== this.props.user.token.updatedAt) {
      const message = nextProps.user.token.message;
      if (message !== null) {
        this.setState({ isLoaded: true, error: message });
        return;
      }
      const attributes = nextProps.user.token.attributes;
      if (Object.keys(attributes).length > 0) {
        if (attributes.isUsed) {
          this.setState({ isLoaded: true, error: 'Token is already used.' });
        } else if (attributes.isExpired) {
          this.setState({ isLoaded: true, error: 'Token is expired.' });
        }
      }
    }
  }

  render(): React$Node {
    if (this.state.isLoaded) {
      const error = this.state.error;
      if (error !== null) {
        return <Error message={error} />;
      }

      return (
        <main>
          <h1 className="mb-4">Reset password</h1>
          <div className="row">
            <div className="col col-md-6">
              <PasswordResetForm />
            </div>
          </div>
        </main>
      );
    }

    return <Loading />;
  }
}

function mapStateToProps(state: RootState): MappedState {
  return { user: state.user };
}

function mapDispatchToProps(dispatch: Dispatch<*>): MappedDispatch {
  return { userMethods: bindActionCreators(userActionCreators, dispatch) };
}

export default withRedirectionIfAuthenticated(withRouter(
  connect(mapStateToProps, mapDispatchToProps)(PasswordResetPage),
));
