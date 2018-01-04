// @flow

import React from 'react';
import { Link } from 'react-router-dom';

import { ROUTE_HOME } from '../constants/routeConstants';

export default function Footer(): React$Node {
  return (
    <footer className="mt-4">
      <ul className="list-inline">
        <li className="list-inline-item"><Link to={ROUTE_HOME}>Home</Link></li>
        <div className="float-sm-right">
          <li className="list-inline-item">&copy; RESTful Boilerplate, {new Date().getFullYear()}</li>
        </div>
      </ul>
    </footer>
  );
}
