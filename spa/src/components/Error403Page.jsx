// @flow

import React from 'react';

import Error from './Error';

export default function Error403Page(): React$Node {
  return (
    <div className="text-center m-5">
      <Error message="Access not allowed." />
    </div>
  );
}
