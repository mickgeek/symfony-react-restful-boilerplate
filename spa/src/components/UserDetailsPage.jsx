// @flow

import React from 'react';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';

import type { Dispatch } from 'redux';

import Loading from './Loading';
import Error from './Error';
import withProfile from './withProfile';
import userActionCreators from '../actions/userActionCreators';
import { getValueAlias } from '../utils/userHelper';

import type { UserState, RootState } from '../reducers/reducerTypes.js.flow';
import type { UserActionCreators } from '../actions/actionCreatorTypes.js.flow';

type Router = {| +match: Object |};

type MappedState = {| +user: UserState |};

type MappedDispatch = {| +userMethods: UserActionCreators |};

type Props = Router & MappedState & MappedDispatch;

type State = {|
  isLoaded: boolean,
  attributes: {
    id?: number,
    email?: string,
    role?: number,
    status?: number,
    createdAt?: Date,
  },
  error: string | null,
|};

class UserDetailsPage extends React.Component<Props, State> {
  state = { isLoaded: false, attributes: {}, error: null };

  componentDidMount(): void {
    this.props.userMethods.viewOne(this.props.match.params.id);
  }

  componentWillReceiveProps(nextProps: Props): void {
    if (nextProps.user.details.updatedAt !== this.props.user.details.updatedAt) {
      const message = nextProps.user.details.message;
      if (message !== null) {
        this.setState({ isLoaded: true, error: message });
        return;
      }
      const attributes = nextProps.user.details.attributes;
      if (Object.keys(attributes).length > 0) {
        this.setState({ isLoaded: true, attributes: { ...attributes } });
      }
    }
  }

  render(): React$Node {
    if (this.state.isLoaded) {
      const error = this.state.error;
      if (error !== null) {
        return <Error message={error} />;
      }

      const attributes = this.state.attributes;
      return (
        <main>
          <h1 className="mb-4">{attributes.email}</h1>
          <div>ID: {attributes.id}</div>
          <div>Email: {attributes.email}</div>
          <div>Role: {getValueAlias('role', attributes.role)}</div>
          <div>Status: {getValueAlias('status', attributes.status)}</div>
          <div>Was registered: {moment(attributes.createdAt).startOf('hour').fromNow()}</div>
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

export default withProfile(withRouter(connect(mapStateToProps, mapDispatchToProps)(UserDetailsPage)));
