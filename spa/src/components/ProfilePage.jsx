// @flow

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';

import type { Dispatch } from 'redux';

import Loading from './Loading';
import withErrorIfWrongRole from './withErrorIfWrongRole';
import userActionCreators from '../actions/userActionCreators';
import { getValueAlias } from '../utils/userHelper';

import type { UserState, RootState } from '../reducers/reducerTypes.js.flow';
import type { UserActionCreators } from '../actions/actionCreatorTypes.js.flow';

type MappedState = {| +user: UserState |};

type MappedDispatch = {| +userMethods: UserActionCreators |};

type Props = MappedState & MappedDispatch;

type State = {|
  isLoaded: boolean,
  attributes: {
    id?: number,
    email?: string,
    role?: number,
    status?: number,
    createdAt?: Date,
    lastLoginAt?: Date,
  },
|};

class ProfilePage extends React.Component<Props, State> {
  state = { isLoaded: false, attributes: {} };

  componentDidMount(): void {
    this.props.userMethods.viewAccount();
  }

  componentWillReceiveProps(nextProps: Props): void {
    if (nextProps.user.account.updatedAt !== this.props.user.account.updatedAt) {
      const attributes = nextProps.user.account.attributes;
      if (Object.keys(attributes).length > 0) {
        this.setState({ isLoaded: true, attributes: { ...attributes } });
      }
    }
  }

  render(): React$Node {
    if (this.state.isLoaded) {
      const attributes = this.state.attributes;
      return (
        <main>
          <h1 className="mb-4">{attributes.email}</h1>
          <div>ID: {attributes.id}</div>
          <div>Email: {attributes.email}</div>
          <div>Role: {getValueAlias('role', attributes.role)}</div>
          <div>Status: {getValueAlias('status', attributes.status)}</div>
          <div>Was registered: {moment(attributes.createdAt).startOf('hour').fromNow()}</div>
          <br />
          <div>Last login at: {moment(attributes.lastLoginAt).format('LLL')}</div>
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

export default withErrorIfWrongRole(connect(mapStateToProps, mapDispatchToProps)(ProfilePage));
