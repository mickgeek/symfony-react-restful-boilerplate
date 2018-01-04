// @flow

import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import ProfilePage from './ProfilePage';

import type { UserState, RootState } from '../reducers/reducerTypes.js.flow';

function getDisplayName(WrappedComponent: React$ComponentType<*>): string {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

type Router = {| +match: Object |};

type MappedState = {| +user: UserState |};

type Props = Router & MappedState;

export default function withProfile(WrappedComponent: React$ComponentType<*>): React$ComponentType<*> {
  function WithProfile(props: Props): React$Node {
    if (Number(props.match.params.id) === props.user.identity.id) {
      return <ProfilePage />;
    }

    return <WrappedComponent />;
  }

  WithProfile.displayName = `WithProfile(${getDisplayName(WrappedComponent)})`;

  function mapStateToProps(state: RootState): MappedState {
    return { user: state.user };
  }

  return withRouter(connect(mapStateToProps)(WithProfile));
}
