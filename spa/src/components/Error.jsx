// @flow

import React from 'react';

type Props = {| heading?: string, message?: string |};

type State = {| heading: string, message: string |};

export default class Error extends React.Component<Props, State> {
  state = {
    heading: this.props.heading || 'Error',
    message: this.props.message || 'Unexpected error occurred.',
  };

  render(): React$Node {
    return (
      <div>
        <h1 className="mb-4">{this.state.heading}</h1>
        <p>{this.state.message}</p>
      </div>
    );
  }
}
