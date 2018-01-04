// @flow

import React from 'react';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import type { Dispatch } from 'redux';

import Loading from './Loading';
import Error from './Error';
import withErrorIfWrongRole from './withErrorIfWrongRole';
import userActionCreators from '../actions/userActionCreators';

import type { UserState, RootState } from '../reducers/reducerTypes.js.flow';
import type { UserActionCreators } from '../actions/actionCreatorTypes.js.flow';

type Router = {| +match: Object |};

type MappedState = {| +user: UserState |};

type MappedDispatch = {| +userMethods: UserActionCreators |};

type Props = Router & MappedState & MappedDispatch;

type State = {| isLoaded: boolean, error: string | null |};

class EmailChangeConfirmationPage extends React.Component<Props, State> {
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
          return;
        }
      }

      this.props.userMethods.confirmEmailChange(this.props.match.params.token);
    }
  }

  render(): React$Node {
    if (this.state.isLoaded) {
      const error = this.state.error;
      if (error !== null) {
        return <Error message={error} />;
      }
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

export default withErrorIfWrongRole(withRouter(
  connect(mapStateToProps, mapDispatchToProps)(EmailChangeConfirmationPage),
));
