// @flow

import React from 'react';

export default function Footer(): React$Node {
  return (
    <footer className="mt-4">
      <div className="float-sm-right">
        <p>&copy; RESTful Boilerplate, {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}
