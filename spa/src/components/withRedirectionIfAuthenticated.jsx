// @flow

import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { ROUTE_HOME } from '../constants/routeConstants';

import type { UserState, RootState } from '../reducers/reducerTypes.js.flow';

function getDisplayName(WrappedComponent: React$ComponentType<*>): string {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

type MappedState = {| +user: UserState |};

type MappedDispatch = {| dispatch: Dispatch<Function> |};

type Props = MappedState & MappedDispatch;

export default function withRedirectionIfAuthenticated(
  WrappedComponent: React$ComponentType<*>,
): Class<React$Component<*>> {
  class WithRedirectionIfAuthenticated extends React.Component<Props> {
    constructor(props: Props): void {
      super(props);
      if (props.user.identity.id !== null) {
        props.dispatch(push(ROUTE_HOME));
      }
    }

    render(): React$Node {
      return <WrappedComponent />;
    }
  }

  WithRedirectionIfAuthenticated.displayName = `WithRedirectionIfAuthenticated(${getDisplayName(WrappedComponent)})`;

  function mapStateToProps(state: RootState): MappedState {
    return { user: state.user };
  }

  function mapDispatchToProps(dispatch: Dispatch<*>): MappedDispatch {
    return { dispatch };
  }

  return connect(mapStateToProps, mapDispatchToProps)(WithRedirectionIfAuthenticated);
}
