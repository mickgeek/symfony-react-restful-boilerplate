// @flow

import React from 'react';
import { NavLink } from 'react-router-dom';

import { BACKEND_ROUTE_DASHBOARD, BACKEND_ROUTE_USER_LIST } from '../../constants/routeConstants';

export default function Sidebar(): React$Node {
  return (
    <aside className="nav flex-column nav-pills">
      <NavLink exact to={BACKEND_ROUTE_DASHBOARD} className="nav-link" activeClassName="active bg-secondary">Dashboard</NavLink>
      <NavLink to={BACKEND_ROUTE_USER_LIST} className="nav-link" activeClassName="active bg-secondary">Users</NavLink>
    </aside>
  );
}
