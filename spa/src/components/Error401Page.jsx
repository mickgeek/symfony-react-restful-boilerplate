// @flow

import React from 'react';

import Error from './Error';

export default function Error401Page(): React$Node {
  return (
    <div className="text-center m-5">
      <Error message="Authorization is needed." />
    </div>
  );
}
