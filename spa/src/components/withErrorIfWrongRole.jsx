// @flow

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import appActionCreators from '../actions/appActionCreators';

import type { UserState, RootState } from '../reducers/reducerTypes.js.flow';
import type { AppActionCreators } from '../actions/actionCreatorTypes.js.flow';

function getDisplayName(WrappedComponent: React$ComponentType<*>): string {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

type MappedState = {| +user: UserState |};

type MappedDispatch = {| +appMethods: AppActionCreators |};

type Props = MappedState & MappedDispatch;

export default function withErrorIfWrongRole(
  WrappedComponent: React$ComponentType<*>,
  correctRoles: (?number)[] = [],
): Class<React$Component<*>> {
  class WithErrorIfWrongRole extends React.Component<Props> {
    constructor(props: Props): void {
      super(props);
      if (props.user.identity.id === null) {
        props.appMethods.updateErrorCode(401);
        return;
      }
      if (correctRoles.length > 0 && !correctRoles.includes(props.user.identity.role)) {
        props.appMethods.updateErrorCode(403);
      }
    }

    render(): React$Node {
      return <WrappedComponent />;
    }
  }

  WithErrorIfWrongRole.displayName = `WithErrorIfWrongRole(${getDisplayName(WrappedComponent)})`;

  function mapStateToProps(state: RootState): MappedState {
    return { user: state.user };
  }

  function mapDispatchToProps(dispatch: Dispatch<*>): MappedDispatch {
    return { appMethods: bindActionCreators(appActionCreators, dispatch) };
  }

  return connect(mapStateToProps, mapDispatchToProps)(WithErrorIfWrongRole);
}
