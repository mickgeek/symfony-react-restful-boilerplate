// @flow

import React from 'react';

export default function HomePage(): React$Node {
  return (
    <main>
      <div className="jumbotron">
        <h1 className="display-3">Hello world!</h1>
        <p className="lead">React-powered project was created successfully.</p>
        <p>
          <a
            href="https://facebook.github.io/react/docs/hello-world.html"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-lg"
          >Get React documentation</a>
        </p>
      </div>
    </main>
  );
}
