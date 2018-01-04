// @flow

import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import type { Dispatch } from 'redux';

import {
  ROUTE_HOME,
  ROUTE_LOGIN,
  ROUTE_REGISTRATION,
  ROUTE_SETTINGS,
  ROUTE_USER_LIST,
  ROUTE_USER_DETAILS,
} from '../constants/routeConstants';
import userActionCreators from '../actions/userActionCreators';

import type { UserState, RootState } from '../reducers/reducerTypes.js.flow';
import type { UserActionCreators } from '../actions/actionCreatorTypes.js.flow';

type MappedState = {| +user: UserState |};

type MappedDispatch = {| +userMethods: UserActionCreators |};

type Props = MappedState & MappedDispatch;

class Header extends React.Component<Props> {
  handleLogout = (event: SyntheticEvent<HTMLLinkElement>): void => {
    event.preventDefault();
    this.props.userMethods.logOut();
  }

  render(): React$Node {
    let navLinks = (
      <ul className="navbar-nav ml-auto">
        <NavLink to={ROUTE_LOGIN} className="nav-link" activeClassName="active">Log in</NavLink>
        <NavLink to={ROUTE_REGISTRATION} className="nav-link" activeClassName="active">Register</NavLink>
      </ul>
    );
    if (this.props.user.identity.id !== null) {
      navLinks = (
        <ul className="navbar-nav ml-auto">
          <NavLink
            to={ROUTE_USER_DETAILS.replace(':id', String(this.props.user.identity.id))}
            className="nav-link"
            activeClassName="active"
          >Profile</NavLink>
          <NavLink to={ROUTE_SETTINGS} className="nav-link" activeClassName="active">Settings</NavLink>
          <span
            tabIndex="0"
            role="button"
            className="nav-link"
            style={{ cursor: 'pointer' }}
            onClick={this.handleLogout}
          >Log out</span>
        </ul>
      );
    }

    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
        <div className="container">
          <Link to={ROUTE_HOME} className="navbar-brand" >RESTful Boilerplate</Link>
          <button
            type="button"
            className="navbar-toggler"
            data-toggle="collapse"
            data-target="#main-nav"
            aria-controls="main-nav"
            aria-expanded="false"
          ><span className="navbar-toggler-icon" /></button>
          <div id="main-nav" className="collapse navbar-collapse">
            <ul className="navbar-nav">
              <NavLink exact to={ROUTE_HOME} className="nav-link" activeClassName="active">Home</NavLink>
              <NavLink to={ROUTE_USER_LIST} className="nav-link" activeClassName="active">Users</NavLink>
            </ul>
            {navLinks}
          </div>
        </div>
      </nav>
    );
  }
}

function mapStateToProps(state: RootState): MappedState {
  return { user: state.user };
}

function mapDispatchToProps(dispatch: Dispatch<*>): MappedDispatch {
  return { userMethods: bindActionCreators(userActionCreators, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
