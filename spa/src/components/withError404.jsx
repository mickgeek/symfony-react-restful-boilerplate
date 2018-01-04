// @flow

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import appActionCreators from '../actions/appActionCreators';

import type { AppActionCreators } from '../actions/actionCreatorTypes.js.flow';

function getDisplayName(WrappedComponent: React$ComponentType<*>): string {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

type MappedDispatch = {| +appMethods: AppActionCreators |};

export default function withError404(WrappedComponent: React$ComponentType<*>): Class<React$Component<*>> {
  class WithError404 extends React.Component<MappedDispatch> {
    constructor(props: MappedDispatch): void {
      super(props);
      props.appMethods.updateErrorCode(404);
    }

    render(): React$Node {
      return <WrappedComponent />;
    }
  }

  WithError404.displayName = `WithError404(${getDisplayName(WrappedComponent)})`;

  function mapDispatchToProps(dispatch: Dispatch<*>): MappedDispatch {
    return { appMethods: bindActionCreators(appActionCreators, dispatch) };
  }

  return connect(null, mapDispatchToProps)(WithError404);
}
